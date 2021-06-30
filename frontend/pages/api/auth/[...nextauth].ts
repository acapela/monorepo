import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions, User as ProviderUser } from "next-auth";
import { AdapterInstance, SendVerificationRequestParams } from "next-auth/adapters";
import Providers from "next-auth/providers";
import { initializeSecrets } from "~config";
import { Account, db, User } from "~db";
import { assert } from "~shared/assert";
import { DEFAULT_NOTIFICATION_EMAIL, sendEmail } from "~shared/email";
import { DEFAULT_ROLE, ALLOWED_ROLES } from "~shared/roles";

/**
 * In this file we manage authorization integration using next-auth.
 *
 * It makes it easy to define integration once and than add new providers (fb, twitter, etc) easily.
 */

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

// Profile interface returned from OAuth
interface Profile {
  name: string;
  email: string;
  image: string;
}

// We don't support sessions as we use JWT
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Session {}

// Note: This is to be implemented when we'll want to add 'magic link' authorization with email.
// eslint-disable-next-line @typescript-eslint/no-empty-interface

// To make sure TypeScript guards us when defining auth <> db adapter, lets use types provided by next-auth
type AuthAdapter = AdapterInstance<User, Profile, Session>;

async function checkWhitelist(profile: Profile) {
  const email = profile.email.toLocaleLowerCase();

  const teamInviteEntry = await db.team_invitation.findFirst({ where: { email } });
  if (teamInviteEntry) return;

  const whiteListEntry = await db.whitelist.findFirst({ where: { email } });

  if (!whiteListEntry) {
    // automatically add a non-whitelisted user to whitelist
    await db.whitelist.create({
      data: { email: profile.email.toLocaleLowerCase(), is_approved: false },
    });
    throw new Error("email not whitelisted");
  }

  if (!whiteListEntry.is_approved) {
    throw new Error("email not approved");
  }
}

function getIsNewUser(user: User | ProviderUser): user is ProviderUser {
  if (user.created_at) return false;

  return true;
}

const authAdapterProvider = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getAdapter(): Promise<AuthAdapter> {
    await initializeSecrets();

    return {
      async createUser(profile) {
        if (process.env.ENABLE_WHITELIST) await checkWhitelist(profile);

        // noinspection UnnecessaryLocalVariableJS
        const user = await db.user.create({
          data: { name: profile.name, email: profile.email, avatar_url: profile.image },
        });

        return user;
      },

      async updateUser(userData) {
        const { name, avatar_url, email_verified } = userData;

        // There is a bug in next-auth that might result in email verification date being kept in camel-case field.
        // This field is not compatible with our db so let's re-map it.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const fixedEmailVerified: Date | null = email_verified ?? userData["emailVerified"];

        // noinspection UnnecessaryLocalVariableJS
        const user = await db.user.update({
          where: { id: userData.id },
          data: {
            // Never update email, user id and other critical data.
            name,
            avatar_url,
            email_verified: fixedEmailVerified,
          },
        });

        return user;
      },

      async getUser(id) {
        return await db.user.findFirst({ where: { id } });
      },

      async getUserByProviderAccountId(providerId, providerAccountId) {
        const accountWithUser = await db.account.findFirst({
          where: { provider_account_id: providerAccountId, provider_id: providerId },
          include: { user: true },
        });

        return accountWithUser?.user ?? null;
      },

      async getUserByEmail(email) {
        return await db.user.findFirst({ where: { email } });
      },

      async linkAccount(userId, providerId, providerType, providerAccountId, refreshToken, accessToken) {
        await db.account.create({
          data: {
            user_id: userId,
            provider_id: providerId,
            provider_type: providerType,
            provider_account_id: providerAccountId,
            refresh_token: refreshToken,
            access_token: accessToken,
          },
        });
      },

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async createSession(user: User) {
        // We're using JWT so sessions are not needed.
        return {};
        // throw new SessionsNotSupportedError();
      },

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async getSession(sessionToken: string) {
        // We're using JWT so sessions are not needed.
        return {};
        // throw new SessionsNotSupportedError();
      },

      async updateSession(session: Session) {
        // We're using JWT so sessions are not needed.
        return session;
        // throw new SessionsNotSupportedError();
      },

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async deleteSession(sessionToken: string) {
        // We're using JWT so sessions are not needed.
        // throw new SessionsNotSupportedError();
      },
      // Those will have to be implemented to add support for 'magic link'
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async createVerificationRequest(identifier, url, token, secret, provider, options) {
        const { sendVerificationRequest } = provider;
        const ONE_DAY = 1000 * 24 * 60 * 60;
        const expires = new Date(Date.now() + ONE_DAY);
        const verificationRequest = await db.verification_requests.create({ data: { identifier, token, expires } });

        await sendVerificationRequest({ identifier, url } as SendVerificationRequestParams);
        return verificationRequest;
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async getVerificationRequest(identifier, token, secret, provider) {
        return await db.verification_requests.findFirst({ where: { identifier, token } });
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async deleteVerificationRequest(identifier, token, secret, provider) {
        await db.verification_requests.deleteMany({ where: { identifier, token } });
      },
    };
  },
};

interface VerificationRequestParams {
  identifier: string;
  url: string;
  // baseUrl: string;
  // token: string;
  // provider: ProviderEmailOptions;
}

async function sendVerificationRequest({ identifier: email, url }: VerificationRequestParams) {
  await sendEmail({
    from: DEFAULT_NOTIFICATION_EMAIL,
    subject: "Login to acapela",
    to: email,
    text: `Hello, click this link to log in - ${url}`,
  });
}

const GOOGLE_AUTH_SCOPES = [
  "userinfo.profile",
  "userinfo.email",
  "calendar.readonly",
  "calendar.events",
  "directory.readonly",
];

async function getAuthInitOptions() {
  await initializeSecrets();
  const authInitOptions: NextAuthOptions = {
    secret: process.env.AUTH_SECRET,
    jwt: {
      secret: process.env.AUTH_JWT_TOKEN_SECRET,
      encryption: false,
      // By default the JSON Web Token is signed with SHA256 and encrypted with AES.
      // We use HS256 token signature in order to make it compatible with hasura JWT
      encode: async (tokenData) => {
        if (!tokenData?.token) {
          throw new Error("JWT Token not found");
        }
        return jwt.sign(tokenData.token, tokenData.secret, { algorithm: "HS256" });
      },
      decode: async (tokenData) => {
        if (!tokenData?.token) {
          throw new Error("JWT Token not found");
        }
        const decodedToken = jwt.verify(tokenData.token, tokenData.secret, { algorithms: ["HS256"] });

        return decodedToken as Record<string, unknown>;
      },
    },
    session: {
      // Use JSON Web Tokens for session instead of database sessions.
      jwt: true,
    },
    pages: {
      error: "/auth/error", // Error code passed in query string as ?error=
    },
    useSecureCookies: false,
    debug: process.env.NODE_ENV === "development",
    callbacks: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      jwt: async (token, user: User, account: Account, profile: Profile) => {
        if (!user) {
          return token;
        }

        return {
          ...token,
          id: token.sub,
          // Add some useful information we might use in the frontend.
          picture: user.avatar_url,
          name: profile.name,
          currentTeamId: user.current_team_id ?? null,
          // Make JWT token compatible with hasura
          "https://hasura.io/jwt/claims": {
            "x-hasura-allowed-roles": ALLOWED_ROLES,
            "x-hasura-default-role": DEFAULT_ROLE,
            "x-hasura-user-id": user.id,
          },
        };
      },

      async signIn(user: User | ProviderUser, accountInfo) {
        if (getIsNewUser(user)) {
          return true;
        }

        try {
          const existingAccount = await db.account.findFirst({
            where: { user_id: user.id, provider_id: accountInfo.provider },
          });

          // If our current account has no refresh token, try to update it if we have it now.
          if (existingAccount) {
            if (accountInfo.refreshToken) {
              await db.account.update({
                where: { id: existingAccount.id },
                data: { refresh_token: accountInfo.refreshToken },
              });
            }
          }

          return true;
        } catch (error) {
          return false;
        }
      },
      // As we're not using sessions (but JWT), let's make session simply return token data.
      // Note: Next-auth will return token data only if token is validated and valid.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      session: async (session, tokenData) => {
        const userId = Reflect.get(tokenData, "sub") as string;
        if (!userId) return null;

        const user = await db.user.findFirst({ where: { id: userId } });

        if (!user) return null;

        Reflect.set(tokenData, "currentTeamId", user.current_team_id);

        // In dev mode, we often wipe out the db so we cannot fully trust JWT. Let's double check it
        if (process.env.NODE_ENV === "development") {
          if (user.current_team_id) {
            const team = await db.team.findFirst({ where: { id: user.current_team_id } });

            if (!team) {
              Reflect.set(tokenData, "currentTeamId", null);
              await db.user.update({ where: { id: user.id }, data: { current_team_id: null } });
            }
          }
        }

        return tokenData;
      },
    },
    cookies: {
      sessionToken: {
        name: `next-auth.session-token`,
        options: {
          /**
           * !!!
           * We make session cookie accessible on client side.
           *
           * This is because it seems to be the only way to make it work with hasura.
           *
           * Context:
           * Hasura requires token to be present in request header using Bearer token.
           * In order to provide this header, we need to know token on client side.
           *
           * By default next-auth uses http-only cookies to store token. This means token is only
           * accessible for server during request and is 'invisible' on client side. This is more
           * secure as it makes it impossible for evil scripts to 'steal' the token on client side.
           *
           * Workaround could be to create proxy server that 'translates' request moving token from
           * cookie to header of the request.
           *
           * We've decided to use client side token for sake of faster development now and consider
           * adding proxy later.
           *
           * The perfect solution would be configurable option in hasura that allows reading JWT from
           * cookie. But seems its not possible right now (https://github.com/hasura/graphql-engine/issues/2183)
           */
          httpOnly: false, // <-- ! We make this cookie accessible on client side.
          sameSite: "lax",
          path: "/",
          secure: false,
        },
      },
    },

    // Configure one or more authentication providers
    providers: [
      Providers.Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // Added `prompt=select_account` to default url to always ask which gmail user do you want to authorize.
        // It is useful if you'd like to login with multiple google accounts on the same machine. Without this param,
        // it would automatically pick previous user each time.
        // authorizationUrl: `https://accounts.google.com/o/oauth2/auth?response_type=code&prompt=select_account`,
        authorizationUrl: `https://accounts.google.com/o/oauth2/auth?${getSearchParams({
          response_type: "code",
          prompt: "select_account",
          /**
           * !!!
           *
           * This will make sure we get refresh token each time user gives content for our access scopes
           */
          access_type: "offline",
        })}`,

        // Beside default scope, we need calendar access.
        scope: GOOGLE_AUTH_SCOPES.map((scopeName) => `https://www.googleapis.com/auth/${scopeName}`).join(" "),
      }),
      Providers.Email({
        sendVerificationRequest,
      }),
    ],
    // Adding our custom db adapter.
    adapter: authAdapterProvider,
  };

  return authInitOptions;
}

function getSearchParams(params: Record<string, string>) {
  return new URLSearchParams(params).toString();
}

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const authOptions = await getAuthInitOptions();
  return NextAuth(req, res, authOptions);
};
