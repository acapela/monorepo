import jwt from "jsonwebtoken";

import { UserTokenData } from "~shared/types/jwtAuth";

import { AuthenticationError } from "../errors/errorTypes";

export function verifyAndParseJWT<AssumedData>(token: string) {
  try {
    const parsedData = jwt.verify(token, process.env.AUTH_JWT_TOKEN_SECRET, { algorithms: ["HS256"] });

    return parsedData as AssumedData;
  } catch (error) {
    throw new AuthenticationError();
  }
}

export function verifyAndParseUserJWT(token: string) {
  const tokenData = verifyAndParseJWT<UserTokenData>(token);

  // TODO: Verify that token has not expired https://linear.app/acapela/issue/ACA-519/verify-tokens-expiration-and-auto-refresh-them-on-frontend

  return tokenData;
}
