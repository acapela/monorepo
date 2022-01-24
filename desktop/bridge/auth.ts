import { createInvokeBridge } from "./base/channels";
import { createElectronPersistedValue } from "./base/persistance";

export const authTokenBridgeValue = createElectronPersistedValue<string | null>("auth-token", () => null);
export const notionAuthTokenBridgeValue = createElectronPersistedValue<string | null>("notion-auth-token", () => null);

export const loginBridge = createInvokeBridge("login");
export const loginNotionBridge = createInvokeBridge("login-notion");

export async function logout() {
  authTokenBridgeValue.set(null);
}
