import Cookie from "js-cookie";
import { assertGet } from "~shared/assert";
import { parseJWTWithoutValidation } from "./jwt";
import { UserAuthData } from "./useCurrentUser";

export const TOKEN_COOKIE_NAME = "next-auth.session-token";

export function readCurrentToken(): string | null {
  return Cookie.get(TOKEN_COOKIE_NAME) ?? null;
}

export function readUserDataFromCookie() {
  const token = readCurrentToken();

  if (!token) return null;

  return parseJWTWithoutValidation<UserAuthData>(token);
}

export function assertReadUserDataFromCookie() {
  const user = readUserDataFromCookie();

  return assertGet(user, "No user during assertReadUserDataFromCookie");
}
