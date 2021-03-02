import { initializeSecrets } from "@acapela/config";
import { Account, db, User, VerificationRequest } from "@acapela/db";
import { assert } from "@acapela/shared/assert";
import { sendEmail } from "@acapela/shared/email";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { InitOptions } from "next-auth";
import { Adapter, AdapterInstance } from "next-auth/adapters";
import Providers from "next-auth/providers";

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

// We dont support sessions as we use JWT
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Session {}

// Note: This is to be implemented when we'll want to add 'magic link' authorization with email.
// eslint-disable-next-line @typescript-eslint/no-empty-interface

// To make sure TypeScript guards us when defining auth <> db adapter, lets use types provided by next-auth
type AuthAdapter = AdapterInstance<User, Profile, Session, VerificationRequest>;

const authAdapterProvider: Adapter = {
  async getAdapter(appOptions): Promise<AuthAdapter> {
    await initializeSecrets();

    return {
      async createUser(profile) {
        const user = await db.user.create({
          data: { name: profile.name, email: profile.email, avatar_url: profile.image },
        });

        return user;
      },

      async updateUser(userData) {
        const user = await db.user.update({ where: { id: userData.id }, data: { ...userData } });

        return user;
      },

      async getUser(id) {
        const user = await db.user.findFirst({ where: { id } });

        return user;
      },

      async getUserByProviderAccountId(providerId, providerAccountId) {
        const accountWithUser = await db.account.findFirst({
          where: { provider_account_id: providerAccountId, provider_id: providerId },
          include: { user: true },
        });

        return accountWithUser?.user ?? null;
      },

      async getUserByEmail(email) {
        const user = await db.user.findFirst({ where: { email } });

        return user;
      },

      async linkAccount(
        userId,
        providerId,
        providerType,
        providerAccountId,
        refreshToken,
        accessToken,
        accessTokenExpires
      ) {
        await db.account.create({
          data: {
            user_id: userId,
            provider_id: providerId,
            provider_type: providerType,
            provider_account_id: providerAccountId,
            refresh_token: refreshToken,
            access_token: accessToken,
            access_token_expires: new Date(accessTokenExpires),
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

        await sendVerificationRequest({ identifier, url, token, baseUrl: appOptions.baseUrl, provider });
        return verificationRequest;
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async getVerificationRequest(identifier, token, secret, provider) {
        const verificationRequest = await db.verification_requests.findFirst({ where: { identifier, token } });

        return verificationRequest;
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
  baseUrl: string;
  token: string;
  // provider: ProviderEmailOptions;
}

async function sendVerificationRequest({ identifier: email, baseUrl, token, url }: VerificationRequestParams) {
  await sendEmail({
    from: "acapela@meetnomore.com",
    subject: "Login to acapela",
    to: email,
    text: `Hello, click this link to log in - ${url}`,
  });
}

async function getAuthInitOptions() {
  await initializeSecrets();
  const authInitOptions: InitOptions = {
    secret: process.env.AUTH_SECRET,
    jwt: {
      secret: process.env.AUTH_JWT_TOKEN_SECRET,
      encryption: false,
      // By default the JSON Web Token is signed with SHA256 and encrypted with AES.
      // We use HS256 token signature in order to make it compatible with hasura JWT
      encode: async ({ secret, token }) => {
        if (!token) {
          throw new Error("JWT Token not found");
        }
        const encodedToken = jwt.sign(token, secret, { algorithm: "HS256" });
        return encodedToken;
      },
      decode: async ({ secret, token }) => {
        if (!token) {
          throw new Error("JWT Token not found");
        }
        const decodedToken = jwt.verify(token, secret, { algorithms: ["HS256"] });

        return decodedToken as Record<string, unknown>;
      },
    },
    session: {
      // Use JSON Web Tokens for session instead of database sessions.
      jwt: true,
    },
    useSecureCookies: false,
    debug: process.env.NODE_ENV === "development",
    callbacks: {
      jwt: async (token, user: User, account: Account, profile: Profile) => {
        if (!user) {
          return token;
        }

        return {
          ...token,
          // Add some useful informations we might use in the frontend.
          picture: user.avatar_url,
          name: profile.name,
          // Make JWT token compatible with hasura
          "https://hasura.io/jwt/claims": {
            "x-hasura-allowed-roles": ["user"],
            "x-hasura-default-role": "user",
            "x-hasura-user-id": user.id,
          },
        };
      },
      // As we're not using sessions (but JWT), let's make session simply return token data.
      // Note: Next-auth will return token data only if token is validated and valid.
      session: async (session, tokenData) => {
        return tokenData;
      },
    },
    cookies: {
      sessionToken: {
        name: `next-auth.session-token`,
        options: {
          /**
           * !!!
           * We make session cookie accessable on client side.
           *
           * This is because it seems to be the only way to make it work with hasura.
           *
           * Context:
           * Hasura requires token to be present in request header using Bearer token.
           * In order to provide this header, we need to know token on client side.
           *
           * By default next-auth uses http-only cookies to store token. This means token is only
           * accessable for server during request and is 'invisible' on client side. This is more
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
          httpOnly: false, // <-- ! We make this cookie accessable on client side.
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
        // Beside default scope, we need calendar access.
        // scope: "https://www.googleapis.com/auth/calendar.readonly",
        scope:
          "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.readonly",
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

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const authOptions = await getAuthInitOptions();
  return NextAuth(req, res, authOptions);
};
