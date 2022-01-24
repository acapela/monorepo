import { authTokenBridgeValue } from "@aca/desktop/bridge/auth";
import { parseJWTWithoutValidation } from "@aca/shared/jwt";

export function useCurrentUser() {
  const rawToken = authTokenBridgeValue.use();

  if (!rawToken) return null;

  try {
    const userData = parseJWTWithoutValidation(rawToken);

    return userData;
  } catch (error) {
    return null;
  }
}
