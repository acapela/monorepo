import { createInvokeBridge } from "./base/channels";
import { createElectronPersistedValue } from "./base/persistance";

export const authTokenBridgeValue = createElectronPersistedValue<string | null>("auth-token", () => null);

export const loginBridge = createInvokeBridge("login");

export async function logout() {
  authTokenBridgeValue.set(null);
}
