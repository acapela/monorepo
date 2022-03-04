import React from "react";

import {
  authTokenBridgeValue,
  googleAuthTokenBridgeValue,
  loginBridge,
  loginGoogleBridge,
} from "@aca/desktop/bridge/auth";
import { clearAllDataRequest } from "@aca/desktop/bridge/system";
import { IconCross, IconLogOut, IconPlus, IconRefreshCw } from "@aca/ui/icons";
import { GoogleGLogoIcon } from "@aca/ui/icons/logos/GoogleGLogo";
import { SlackLogo } from "@aca/ui/icons/logos/SlackLogo";

import { defineAction } from "./action";
import { ActionContext } from "./action/context";
import { defineGroup } from "./action/group";

// import { BrowserWindow, session } from "electron";
// import { authWindowDefaultOptions } from "../electron/auth/utils";
// import { FRONTEND_URL } from "../lib/env";

export const accountActionsGroup = defineGroup({
  name: "Account",
});

export function getContextualServiceName(name: string) {
  return (ctx: ActionContext) => (ctx.isContextual ? "Connect" : `Connect ${name}`);
}

export const loginToAcapelaWithGoogle = defineAction({
  name: "Continue with Google",
  group: accountActionsGroup,
  icon: <GoogleGLogoIcon />,
  canApply: () => !authTokenBridgeValue.get(),
  async handler() {
    await loginBridge("google");
  },
});

export const loginToAcapelaWithSlack = defineAction({
  name: "Continue with Slack",
  group: accountActionsGroup,
  icon: <SlackLogo />,
  canApply: () => !authTokenBridgeValue.get(),
  async handler() {
    await loginBridge("slack");
  },
});

export const connectIntegration = defineAction({
  name: (ctx) => {
    const integration = ctx.assertTarget("integration");

    return ctx.isContextual ? "Connect" : `Connect ${integration.name}`;
  },
  icon: <IconPlus />,
  group: accountActionsGroup,
  canApply: (ctx) => {
    const integration = ctx.getTarget("integration");

    if (!integration) return false;

    return !integration.getIsConnected() && integration.getCanConnect?.() !== false;
  },
  async handler(ctx) {
    const integration = ctx.assertTarget("integration");

    return integration.connect();
  },
});

export const disconnectIntegration = defineAction({
  name: (ctx) => {
    const integration = ctx.assertTarget("integration");

    return ctx.isContextual ? "Disconnect" : `Disconnect ${integration.name}`;
  },
  icon: <IconCross />,
  group: accountActionsGroup,
  canApply: (ctx) => {
    const integration = ctx.getTarget("integration");

    if (!integration) return false;

    return integration.getIsConnected() && !!integration.disconnect;
  },
  async handler(ctx) {
    const integration = ctx.assertTarget("integration");

    return integration.disconnect?.();
  },
});

export const connectGoogle = defineAction({
  name: getContextualServiceName("Google"),
  private: true,
  icon: <GoogleGLogoIcon />,
  group: accountActionsGroup,
  canApply: () => !googleAuthTokenBridgeValue.get(),
  async handler() {
    await loginGoogleBridge();
  },
});

export const logOut = defineAction({
  name: "Log out",
  icon: <IconLogOut />,
  group: accountActionsGroup,
  keywords: ["logout", "signout"],
  async handler() {
    // TODO: none of these options work
    // session.defaultSession.cookies.remove(FRONTEND_URL, "next-auth.session-token")
    // const window = new BrowserWindow({ ...authWindowDefaultOptions });
    // window.webContents.loadURL(FRONTEND_URL + `/logout`);
    // logout();
  },
});

export const restartAndClearElectronData = defineAction({
  name: "Restart app",
  icon: <IconRefreshCw />,
  group: accountActionsGroup,
  analyticsEvent: "App Restarted",
  keywords: ["reload", "restart"],
  async handler() {
    clearAllDataRequest();
  },
});
