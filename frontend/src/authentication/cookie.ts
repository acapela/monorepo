import Cookie from "js-cookie";

import { assertDefined } from "~shared/assert";
import { parseJWTWithoutValidation } from "~shared/jwt";
import { UserTokenData } from "~shared/types/jwtAuth";

export const TOKEN_COOKIE_NAME = "next-auth.session-token";

export function readCurrentToken(): string | null {
  return Cookie.get(TOKEN_COOKIE_NAME) ?? null;
}

export function readUserDataFromCookie() {
  const token = readCurrentToken();

  if (!token) return null;

  return parseJWTWithoutValidation<UserTokenData>(token);
}

export function assertReadUserDataFromCookie() {
  const user = readUserDataFromCookie();

  return assertDefined(user, "No user during assertReadUserDataFromCookie");
}
