import { createInvokeWithCleanupBridge } from "@aca/desktop/bridge/base/invokeWithCleanup";

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

export const connectSlackBridge = createInvokeWithCleanupBridge<{ url: string }>("connect-slack");

export const linearAuthTokenBridgeValue = createBridgeValue<boolean>("linear-auth-token", {
  getDefault: () => false,
  isPersisted: true,
});
export const loginLinearBridge = createInvokeBridge("login-linear");

export async function logout() {
  authTokenBridgeValue.set(null);
}
