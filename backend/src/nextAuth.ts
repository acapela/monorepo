import { Application, Request, Response } from "express";
import NextAuth, { DefaultUser, Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import AtlassianProvider from "next-auth/providers/atlassian";
import GoogleProvider from "next-auth/providers/google";
import SlackProvider from "next-auth/providers/slack";

import { setupGmailWatcher } from "@aca/backend/src/gmail/capture";
import { User, db } from "@aca/db";
import { assert } from "@aca/shared/assert";
import { trackBackendUserEvent, trackFirstBackendUserEvent } from "@aca/shared/backendAnalytics";
import { IS_CI, IS_DEV, TESTING_PREFIX } from "@aca/shared/dev";
import { GMAIL_SCOPES, GOOGLE_AUTH_SCOPES, isGmailIncludedInPlan } from "@aca/shared/google";
import { createJWT, signJWT, verifyJWT } from "@aca/shared/jwt";
import { logger } from "@aca/shared/logger";
import { Maybe } from "@aca/shared/types";

import { updateUserOnboardingStatus } from "./tracking/utils";
import { createNewReferralCode } from "./utils";

// Fail quickly in case of missing env variables
function assertEnvVariable(value: unknown, varName: string) {
  assert(value, `Environment variable ${varName} is not provided. It is required to run auth endpoint.`);
}

assertEnvVariable(process.env.DB_USER, "DB_USER");
assertEnvVariable(process.env.DB_PASSWORD, "DB_PASSWORD");
assertEnvVariable(process.env.DB_NAME, "DB_NAME");
assertEnvVariable(process.env.DB_HOST, "DB_HOST");
assertEnvVariable(process.env.AUTH_SECRET, "AUTH_SECRET");
assertEnvVariable(process.env.AUTH_JWT_TOKEN_SECRET, "AUTH_JWT_TOKEN_SECRET");
assertEnvVariable(process.env.GOOGLE_CLIENT_ID, "GOOGLE_CLIENT_ID");
assertEnvVariable(process.env.GOOGLE_CLIENT_SECRET, "GOOGLE_CLIENT_SECRET");
assertEnvVariable(process.env.SLACK_CLIENT_ID, "SLACK_CLIENT_ID");
assertEnvVariable(process.env.SLACK_CLIENT_SECRET, "SLACK_CLIENT_SECRET");

const toAdapterUser = (user: User): AdapterUser => ({ ...user, id: user.id, emailVerified: user.email_verified });
const toMaybeAdapterUser = (user: Maybe<User>): AdapterUser | null => (user ? toAdapterUser(user) : null);

const ACCOUNTS_WITHOUT_USER_UPDATES = ["atlassian"];

const nextAuthMountPath = "/api/auth";

function nextAuthMiddleware(req: Request, res: Response) {
  const referralCode = req.cookies.referral as string | undefined;
  req.query.nextauth = req.path.slice(1).split("/");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return NextAuth(req as any, res as any, {
    secret: process.env.AUTH_SECRET,
    jwt: {
      secret: process.env.AUTH_JWT_TOKEN_SECRET,
      // By default the JSON Web Token is signed with SHA256 and encrypted with AES.
      // We use HS256 token signature in order to make it compatible with hasura JWT
      async encode(tokenData) {
        if (!tokenData?.token) {
          throw new Error("JWT Token not found");
        }
        return signJWT(tokenData.token, tokenData.secret);
      },
      async decode(tokenData) {
        if (!tokenData?.token) {
          throw new Error("JWT Token not found");
        }
        return verifyJWT(tokenData.token, tokenData.secret) as Record<string, unknown>;
      },
    },
    session: {
      strategy: "jwt",
    },
    pages: {
      signIn: "/login",
      signOut: "/logout",
      error: "/auth/error", // Error code passed in query string as ?error=
    },
    debug: IS_DEV,
    callbacks: {
      jwt: ({ token, user }) => {
        if (!user) {
          return token;
        }
        return createJWT({ ...token, userId: user.id, teamId: user.current_team_id as string });
      },

      async redirect({ url, baseUrl }) {
        if (url.includes("/auth/sign-in")) {
          return `${baseUrl}/auth/success`;
        }
        return url;
      },

      async signIn({ account, profile }) {
        const user = await db.user.findFirst({
          where: {
            account: { some: { provider_account_id: account.providerAccountId, provider_id: account.provider } },
          },
        });

        if (user) {
          trackFirstBackendUserEvent(user, "Logged In");
        }

        try {
          const isGoogleAccount = account.provider == "google";
          const hasGmailScopes = GMAIL_SCOPES.every((scope) => account.scope?.includes(scope));

          // If there is a refresh token, try to update it
          // For Google accounts we only want to update them when they also have the necessary gmail scopes
          if (typeof account.refresh_token == "string" && (!isGoogleAccount || hasGmailScopes)) {
            await db.account.updateMany({
              where: { provider_account_id: account.providerAccountId, provider_id: account.provider },
              data: {
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                email: profile.email,
              },
            });
          }

          if (isGoogleAccount && hasGmailScopes && isGmailIncludedInPlan(user?.subscription_plan)) {
            await setupGmailWatcher(account);
          }

          return true;
        } catch (error) {
          logger.error(error);
          return false;
        }
      },
      async session({ session, token }) {
        const user = toMaybeAdapterUser(await db.user.findFirst({ where: { id: token.id as string } }));
        return createJWT({
          ...session,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          userId: (user?.id ?? token.sub)!,
          user,
        }) as unknown as Session;
      },
    },

    events: {
      async signIn({ user, profile, account }) {
        /*
          Prevents avatar from being updated
          Some providers are linked with nextAuth without exclusively needed for singing in
          This prevents overriding user profile data from most trustworth sources, e.g. google
        */
        if (ACCOUNTS_WITHOUT_USER_UPDATES.includes(account.provider)) {
          return;
        }

        await db.user.update({
          where: { id: user.id },
          data: {
            name: profile?.name ?? undefined,
            avatar_url: profile?.image ?? undefined,
            referral_code: user.referral_code ? undefined : createNewReferralCode(),
          },
        });
      },
      signOut({ token }) {
        trackBackendUserEvent(token.id as string, "Logged Out");
      },
    },

    cookies: {
      sessionToken: {
        name: `next-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: "none",
          path: "/",
          // If this is true in dev, Safari will block this cookie in localhost making it impossible to log in.
          secure: true,
        },
      },
    },

    providers: [
      AtlassianProvider({
        clientId: process.env.ATLASSIAN_CLIENT_ID!,
        clientSecret: process.env.ATLASSIAN_CLIENT_SECRET!,

        authorization: {
          params: {
            scope: [
              "offline_access read:me",
              // creating a webhook
              "read:webhook:jira write:webhook:jira delete:webhook:jira",

              "read:field:jira read:project:jira read:jql:jira",
              "read:issue-details:jira read:project-role:jira read:epic:jira-software",
              "read:issue-type:jira read:group:jira",
              // Required to read a comment :facepalm:
              "read:comment:jira read:user:jira read:comment.property:jira read:role:jira read:status:jira read:issue.property:jira",
              "read:avatar:jira read:issue.watcher:jira",
            ].join(" "),
          },
        },
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: `https://accounts.google.com/o/oauth2/auth?${new URLSearchParams({
          prompt: "select_account consent", // always ask which google user to use, instead of auto picking
          access_type: "offline", // !!! Get new refresh token each time user gives content for our access scopes
          scope: GOOGLE_AUTH_SCOPES,
        })}`,
        allowDangerousEmailAccountLinking: true,
      }),
      SlackProvider({
        clientId: process.env.SLACK_CLIENT_ID,
        clientSecret: process.env.SLACK_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: true,
      }),
    ],

    adapter: {
      async createUser({ email, name, image }: Omit<DefaultUser, "id">) {
        if (process.env.ENABLE_WHITELIST) {
          if (!email) {
            throw new Error("missing email");
          }

          const whiteListEntry = await db.whitelist.findFirst({ where: { email: email.toLowerCase() } });

          if (!whiteListEntry) {
            throw new Error("email not whitelisted");
          }

          if (!whiteListEntry.is_approved) {
            throw new Error("email not approved");
          }
        }

        assert(name && email, "must get name and email from auth adapter");

        const user = await db.user.create({
          data: {
            name,
            email,
            avatar_url: image,
            referral_code: createNewReferralCode(),
            used_referral_code: referralCode?.toUpperCase(),
          },
        });
        trackFirstBackendUserEvent(user, "Signed Up", { email, name, origin: referralCode ? "referred" : "organic" });
        updateUserOnboardingStatus(user);
        return toAdapterUser(user);
      },

      updateUser: async ({ id, name, image, emailVerified }) =>
        toAdapterUser(
          await db.user.update({
            where: { id },
            data: {
              // Never update email, user id and other critical data.
              name: name ?? undefined,
              avatar_url: image ?? undefined,
              email_verified: emailVerified ?? undefined,
            },
          })
        ),

      getUser: async (id) => toMaybeAdapterUser(await db.user.findFirst({ where: { id } })),
      getUserByAccount: async ({ provider, providerAccountId }) =>
        toMaybeAdapterUser(
          await db.user.findFirst({
            where: { account: { some: { provider_account_id: providerAccountId, provider_id: provider } } },
          })
        ),
      getUserByEmail: async (email) => toMaybeAdapterUser(email ? await db.user.findFirst({ where: { email } }) : null),

      async linkAccount(account) {
        await db.$transaction([
          db.account.create({
            data: {
              user_id: account.userId,
              provider_id: account.provider,
              provider_type: account.type,
              provider_account_id: account.providerAccountId,
              refresh_token: account.refresh_token,
              access_token: account.access_token,
              // we need milliseconds for JS Date constructor, and are getting seconds from Google, hence the conversion
              access_token_expires: account.expires_at ? new Date(account.expires_at * 1000).toISOString() : undefined,
            },
          }),
          db.user.update({
            where: { id: account.userId },
            data: {
              // user.has_account will change, but since it is computed we need to bump updated_at
              updated_at: null, // (null sets it to `now()`)
            },
          }),
        ]);
      },

      createSession() {
        throw new Error("Db persisted sessions are not supported. We use JWT instead.");
      },
      updateSession: () => null,
      deleteSession: () => null,
      getSessionAndUser: () => null,
    },
  });
}

export default function (app: Application) {
  if (IS_DEV || IS_CI) {
    app.get("/api/e2e/test_user", async (req, res) => {
      const user = await db.user.findFirst({ where: { email: { contains: TESTING_PREFIX } } });
      if (user) {
        res.json({ jwt: signJWT(createJWT({ userId: user.id })) });
      } else {
        res.json({});
      }
    });
  }
  app.use(nextAuthMountPath, async (req, res) => {
    nextAuthMiddleware(req, res);
  });
}
