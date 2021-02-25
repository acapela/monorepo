import NextAuth, { InitOptions } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import knex from "knex";
import Providers from "next-auth/providers";
import { Adapter, AdapterInstance } from "next-auth/adapters";
import jwt from "jsonwebtoken";
import { initializeSecrets } from "@acapela/config";

/**
 * In this file we manage authorization integration using next-auth.
 *
 * It makes it easy to define integration once and than add new providers (fb, twitter, etc) easily.
 */

// DB table interfaces used inside db auth adapter.

interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
}

interface Account {
  id: string;
  created_at: Date;
  user_id: string;
  provider_id: string;
  provider_type: string;
  provider_account_id: string;
  refresh_token: string;
  access_token: string;
  access_token_expires: number;
  updated_at: string;
}

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
interface EmailVerificationRequest {}

// To make sure TypeScript guards us when defining auth <> db adapter, lets use types provided by next-auth
type AuthAdapter = AdapterInstance<User, Profile, Session, EmailVerificationRequest>;

declare module "knex/types/tables" {
  interface Tables {
    // This is same as specifying `const userDb = knex<User>('users')`
    user: User;
    account: Account;
  }
}

const authAdapterProvider: Adapter = {
  async getAdapter(): Promise<AuthAdapter> {
    await initializeSecrets();

    const database = knex({
      client: "pg",
      connection: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
      },
    });

    return {
      async createUser(profile) {
        const [user] = await database("user")
          .insert({
            name: profile.name,
            email: profile.email,
            avatar_url: profile.image,
          })
          .returning("*");

        return user;
      },

      async updateUser(userData) {
        const [user] = await database("user")
          .where({ id: userData.id })
          .update({ ...userData })
          .returning("*");

        return user;
      },

      async getUser(id) {
        const [user] = await database("user").select("*").where({ id }).limit(1);

        return user;
      },

      async getUserByProviderAccountId(providerId, providerAccountId) {
        const [account] = await database("account")
          .select("*")
          .where({ provider_account_id: providerAccountId, provider_id: providerId })
          .limit(1);

        if (!account) {
          return null;
        }

        // TODO: It could be solved with joins in query above.
        const [user] = await database("user").select("*").where({ id: account.user_id });

        return user ?? null;
      },

      async getUserByEmail(email) {
        const [user] = await database("user").select("*").where({ email });

        return user;
      },

      async linkAccount(
        userId: string,
        providerId: string,
        providerType: string,
        providerAccountId: string,
        refreshToken: string,
        accessToken: string,
        accessTokenExpires: number
      ) {
        await database("account")
          .insert({
            user_id: userId,
            provider_id: providerId,
            provider_type: providerType,
            provider_account_id: providerAccountId,
            refresh_token: refreshToken,
            access_token: accessToken,
            access_token_expires: accessTokenExpires,
          })
          .returning("*");
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
      async createVerificationRequest(email, url, token, secret, provider, options) {
        throw new EmailAuthNotSupportedError();
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async getVerificationRequest(email, verificationToken, secret, provider) {
        throw new EmailAuthNotSupportedError();
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async deleteVerificationRequest(email, verificationToken, secret, provider) {
        throw new EmailAuthNotSupportedError();
      },
    };
  },
};

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
        const encodedToken = jwt.sign(token, secret, { algorithm: "HS256" });
        return encodedToken;
      },
      decode: async ({ secret, token }) => {
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
    ],
    // Adding our custom db adapter.
    adapter: authAdapterProvider,
  };

  return authInitOptions;
}
class EmailAuthNotSupportedError extends Error {
  constructor() {
    super("Internal server error");
  }
}

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const authOptions = await getAuthInitOptions();
  return NextAuth(req, res, authOptions);
};
