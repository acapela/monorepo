import { authTokenBridgeValue } from "@aca/desktop/bridge/auth";
import { parseJWTWithoutValidation } from "@aca/shared/jwt";

export function useCurrentUser() {
  const rawToken = authTokenBridgeValue.use();

  if (!rawToken) return null;

  const userData = parseJWTWithoutValidation(rawToken);

  return userData;
}
