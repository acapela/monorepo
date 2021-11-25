import * as Sentry from "@sentry/node";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { DefaultUser, Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import SlackProvider from "next-auth/providers/slack";

import { initializeSecrets } from "~config";
import { User, db } from "~db";
import { assert } from "~shared/assert";
import { trackBackendUserEvent, trackFirstBackendUserEvent } from "~shared/backendAnalytics";
import { IS_DEV } from "~shared/dev";
import { createJWT, signJWT, verifyJWT } from "~shared/jwt";
import { Maybe } from "~shared/types";

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

const GOOGLE_AUTH_SCOPES = ["userinfo.profile", "userinfo.email"];

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await initializeSecrets();
  return NextAuth(req, res, {
    secret: process.env.AUTH_SECRET,
    jwt: {
      secret: process.env.AUTH_JWT_TOKEN_SECRET,
      encryption: false,
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
      // Use JSON Web Tokens for session instead of database sessions.
      jwt: true,
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

      async signIn({ account }) {
        // fetch user to start tracking them in Mixpanel, can happen in the background
        db.user
          .findFirst({
            where: {
              account: { some: { provider_account_id: account.providerAccountId, provider_id: account.provider } },
            },
          })
          .then(async (user) => {
            if (user) {
              trackFirstBackendUserEvent(user, "Signed In");
            }
          })
          .catch((error) => Sentry.captureException(error));

        try {
          // If our current account has no refresh token, try to update it if we have it now.
          if (typeof account.refreshToken == "string") {
            await db.account.updateMany({
              where: { provider_account_id: account.providerAccountId, provider_id: account.provider },
              data: { refresh_token: account.refreshToken },
            });
          }

          return true;
        } catch (error) {
          console.error(error);
          Sentry.captureException(error);
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
      async signIn({ user, profile }) {
        await db.user.update({
          where: { id: user.id },
          data: { name: profile?.name ?? undefined, avatar_url: profile?.image ?? undefined },
        });
      },
      signOut({ token }) {
        trackBackendUserEvent(token.id as string, "Signed Out");
      },
    },

    cookies: {
      sessionToken: {
        name: `next-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          // If this is true in dev, Safari will block this cookie in localhost making it impossible to log in.
          secure: !IS_DEV,
        },
      },
    },

    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: `https://accounts.google.com/o/oauth2/auth?${new URLSearchParams({
          prompt: "select_account", // always ask which google user to use, instead of auto picking
          access_type: "offline", // !!! Get new refresh token each time user gives content for our access scopes
          scope: GOOGLE_AUTH_SCOPES.map((scopeName) => `https://www.googleapis.com/auth/${scopeName}`).join(" "),
        })}`,
      }),
      SlackProvider({
        clientId: process.env.SLACK_CLIENT_ID,
        clientSecret: process.env.SLACK_CLIENT_SECRET,
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

        const user = await db.user.create({ data: { name, email, avatar_url: image } });

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
        const [, user] = await db.$transaction([
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
        trackFirstBackendUserEvent(user, "Signed Up");
        if (user.current_team_id) {
          trackBackendUserEvent(user.id, "Account Added User", { teamId: user.current_team_id });
        }
      },

      createSession() {
        throw new Error("Db persisted sessions are not supported. We use JWT instead.");
      },
      updateSession: () => null,
      deleteSession: () => null,
      getSessionAndUser: () => null,
    },
  });
};
