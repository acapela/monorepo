import { UserTokenPayload, verifyJWT } from "@aca/shared/jwt";

import { AuthenticationError } from "../errors/errorTypes";

export function verifyAndParseJWT<AssumedData>(token: string) {
  try {
    const parsedData = verifyJWT(token);

    return parsedData as AssumedData;
  } catch (error) {
    throw new AuthenticationError();
  }
}

export function verifyAndParseUserJWT(token: string) {
  const tokenData = verifyAndParseJWT<UserTokenPayload>(token);

  // TODO: Verify that token has not expired https://linear.app/acapela/issue/ACA-519/verify-tokens-expiration-and-auto-refresh-them-on-frontend

  return tokenData;
}
