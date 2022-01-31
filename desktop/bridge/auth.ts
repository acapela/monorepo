import { createInvokeBridge } from "./base/invoke";
import { createBridgeValue } from "./base/persistance";

export const authTokenBridgeValue = createBridgeValue<string | null>("auth-token", {
  getDefault: () => null,
  isPersisted: true,
});
export const loginBridge = createInvokeBridge("login");

export const notionAuthTokenBridgeValue = createBridgeValue<string | null>("notion-auth-token", {
  getDefault: () => null,
  isPersisted: true,
});
export const loginNotionBridge = createInvokeBridge("login-notion");

export const figmaAuthTokenBridgeValue = createBridgeValue<string | null>("figma-auth-token", {
  getDefault: () => null,
  isPersisted: true,
});
export const loginFigmaBridge = createInvokeBridge("login-figma");

export const googleAuthTokenBridgeValue = createBridgeValue<boolean>("google-auth-token", {
  getDefault: () => false,
  isPersisted: true,
});
export const loginGoogleBridge = createInvokeBridge("login-google");

export const slackAuthTokenBridgeValue = createBridgeValue<string | null>("slack-auth-token", {
  getDefault: () => null,
  isPersisted: true,
});
export const loginSlackBridge = createInvokeBridge("login-slack");
export const connectSlackBridge = createInvokeBridge<{ url: string }>("connect-slack");

export async function logout() {
  authTokenBridgeValue.set(null);
}
