import { createInvokeBridge } from "./base/channels";
import { createElectronPersistedValue } from "./base/persistance";

export const authTokenBridgeValue = createElectronPersistedValue<string | null>("auth-token", () => null);
export const loginBridge = createInvokeBridge("login");

export const notionAuthTokenBridgeValue = createElectronPersistedValue<string | null>("notion-auth-token", () => null);
export const loginNotionBridge = createInvokeBridge("login-notion");

export const figmaAuthTokenBridgeValue = createElectronPersistedValue<string | null>("figma-auth-token", () => null);
export const loginFigmaBridge = createInvokeBridge("login-figma");

export const googleAuthTokenBridgeValue = createElectronPersistedValue<boolean>("google-auth-token", () => false);
export const loginGoogleBridge = createInvokeBridge("login-google");

export const slackAuthTokenBridgeValue = createElectronPersistedValue<string | null>("slack-auth-token", () => null);
export const loginSlackBridge = createInvokeBridge("login-slack");
export const connectSlackBridge = createInvokeBridge<void, { url: string }>("connect-slack");

export async function logout() {
  authTokenBridgeValue.set(null);
}
