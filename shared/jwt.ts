import jwt, { JwtPayload, Secret, SignOptions, VerifyOptions } from "jsonwebtoken";

import { isServer } from "@aca/shared/isServer";

const JWT_OPTIONS: SignOptions & VerifyOptions = { algorithm: "HS256" };

export const signJWT = (token: Parameters<typeof jwt.sign>[0], secret: Secret = process.env.AUTH_JWT_TOKEN_SECRET) =>
  jwt.sign(token, secret, JWT_OPTIONS);

export const verifyJWT = (token: string, secret: Secret = process.env.AUTH_JWT_TOKEN_SECRET) =>
  jwt.verify(token, secret, JWT_OPTIONS);

export interface UserTokenPayload {
  iat: number;
  sub: string;
  id: string;
}

export const createJWT = ({ userId, ...payload }: JwtPayload & { userId: string } & Record<string, unknown>) => ({
  ...payload,
  id: payload.sub || userId,
  sub: userId,
  // Make JWT token compatible with hasura
  "https://hasura.io/jwt/claims": {
    "x-hasura-allowed-roles": ["user"],
    "x-hasura-default-role": "user",
    "x-hasura-user-id": userId,
  },
});

/**
 * Browser has built in atob, but on server side we need to polyfill it.
 */
const atob = (encoded: string) => (isServer ? Buffer.from(encoded, "base64").toString("binary") : window.atob(encoded));

/**
 * Will return JWT content as object without validating the signature.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseJWTWithoutValidation<T extends Record<string, any>>(token: string): T {
  const [, tokenContent] = token.split(".");

  const base64 = tokenContent.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (char) {
        return "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
