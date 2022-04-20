import { createInvokeWithCleanupBridge } from "@aca/desktop/bridge/base/invokeWithCleanup";

import { FigmaSessionData } from "../electron/auth/figma";
import { notionSelectedSpaceValue } from "./apps/notion";
import { createInvokeBridge } from "./base/invoke";
import { createBridgeValue } from "./base/persistance";

export const clearServiceCookiesBridge = createInvokeBridge<{ url: string }>("disconnect-service");

export const authTokenBridgeValue = createBridgeValue<string | null>("auth-token", {
  getDefault: () => null,
  isPersisted: true,
});
export const loginBridge = createInvokeBridge<"google" | "slack">("login");

export const canAutoLoginBridge = createInvokeBridge<void, boolean>("can-auto-login");
export const autoLoginBridge = createInvokeBridge("auto-login");

export const logoutBridge = createInvokeBridge("logout");

export const notionAuthTokenBridgeValue = createBridgeValue<string | null>("notion-auth-token", {
  getDefault: () => null,
  isPersisted: true,
});
export const loginNotionBridge = createInvokeBridge("login-notion");

export const figmaAuthTokenBridgeValue = createBridgeValue<FigmaSessionData | null>("figma-auth-session-data", {
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

export const loginLinearBridge = createInvokeBridge<{ logout: boolean } | void>("login-linear");

export const loginJiraBridge = createInvokeBridge<{ logout: boolean } | void>("login-jira");

export const jiraAuthTokenBridgeValue = createBridgeValue<boolean>("jira-auth-token", {
  getDefault: () => false,
  isPersisted: true,
});

export const githubAuthTokenBridgeValue = createBridgeValue<boolean>("github-auth-token", {
  getDefault: () => false,
  isPersisted: true,
});
export const loginGitHubBridge = createInvokeBridge<{ logout: boolean; installationId?: number } | void>(
  "login-github"
);

export const loginGmailBridge = createInvokeWithCleanupBridge("login-gmail");

export const asanaAuthTokenBridgeValue = createBridgeValue<boolean>("asana-auth-token", {
  getDefault: () => false,
  isPersisted: true,
});

export const loginAsanaBridge = createInvokeBridge("login-asana");
export const logoutAsanaBridge = createInvokeBridge<{ webhookId?: string }>("logout-asana");

/*
  NEW SERVICE!?!?!?
  Add new services here! Until refactored
*/

const allServices = [
  notionAuthTokenBridgeValue,
  notionSelectedSpaceValue,
  figmaAuthTokenBridgeValue,
  linearAuthTokenBridgeValue,
  jiraAuthTokenBridgeValue,
  githubAuthTokenBridgeValue,
  asanaAuthTokenBridgeValue,
];

export function resetAllServices() {
  allServices.forEach((s) => s.reset());
}
