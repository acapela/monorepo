import { createInvokeWithCleanupBridge } from "@aca/desktop/bridge/base/invokeWithCleanup";

import { FigmaSessionData } from "../electron/auth/figma";
import { createInvokeBridge } from "./base/invoke";
import { createSessionBridgeValue } from "./base/persistance";

export const clearServiceCookiesBridge = createInvokeBridge<{ url: string }>("disconnect-service");

export const authTokenBridgeValue = createSessionBridgeValue<string | null>("auth-token", {
  getDefault: () => null,
  isPersisted: true,
});
export const loginBridge = createInvokeBridge<"google" | "slack">("login");

export const canAutoLoginBridge = createInvokeBridge<void, boolean>("can-auto-login");
export const autoLoginBridge = createInvokeBridge("auto-login");

export const logoutBridge = createInvokeBridge("logout");

export const notionAuthTokenBridgeValue = createSessionBridgeValue<string | null>("notion-auth-token", {
  getDefault: () => null,
  isPersisted: true,
});
export const loginNotionBridge = createInvokeBridge("login-notion");

export const figmaAuthTokenBridgeValue = createSessionBridgeValue<FigmaSessionData | null>("figma-auth-session-data", {
  getDefault: () => null,
  isPersisted: true,
});
export const loginFigmaBridge = createInvokeBridge("login-figma");

export const googleAuthTokenBridgeValue = createSessionBridgeValue<boolean>("google-auth-token", {
  getDefault: () => false,
  isPersisted: true,
});
export const loginGoogleBridge = createInvokeBridge("login-google");

export const connectSlackBridge = createInvokeWithCleanupBridge<{ url: string }>("connect-slack");

export const linearAuthTokenBridgeValue = createSessionBridgeValue<boolean>("linear-auth-token", {
  getDefault: () => false,
  isPersisted: true,
});

export const loginLinearBridge = createInvokeBridge<{ logout: boolean } | void>("login-linear");

export const loginJiraBridge = createInvokeBridge<{ logout: boolean } | void>("login-jira");

export const jiraAuthTokenBridgeValue = createSessionBridgeValue<boolean>("jira-auth-token", {
  getDefault: () => false,
  isPersisted: true,
});

export const githubAuthTokenBridgeValue = createSessionBridgeValue<boolean>("github-auth-token", {
  getDefault: () => false,
  isPersisted: true,
});
export const loginGitHubBridge = createInvokeBridge<{ logout: boolean; installationId?: number } | void>(
  "login-github"
);

export const loginGmailBridge = createInvokeWithCleanupBridge("login-gmail");

export const asanaAuthTokenBridgeValue = createSessionBridgeValue<boolean>("asana-auth-token", {
  getDefault: () => false,
  isPersisted: true,
});

export const loginAsanaBridge = createInvokeBridge("login-asana");
export const logoutAsanaBridge = createInvokeBridge<{ webhookId?: string }>("logout-asana");

export const clickupAuthTokenBridgeValue = createSessionBridgeValue<boolean>("clickup-auth-token", {
  getDefault: () => false,
  isPersisted: true,
});

export const loginClickUpBridge = createInvokeBridge("login-clickup");
export const logoutClickUpBridge = createInvokeBridge<{ teamId?: string }>("logout-clickup");
