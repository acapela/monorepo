import React from "react";

import {
  authTokenBridgeValue,
  googleAuthTokenBridgeValue,
  loginBridge,
  loginGoogleBridge,
  logoutBridge,
} from "@aca/desktop/bridge/auth";
import { clearAllDataRequest } from "@aca/desktop/bridge/system";
import { IconLogOut, IconPlus, IconRefreshCw } from "@aca/ui/icons";
import { GoogleGLogoIcon } from "@aca/ui/icons/logos/GoogleGLogo";
import { SlackLogo } from "@aca/ui/icons/logos/SlackLogo";

import { showConfirmDialogRequest } from "../bridge/dialogs";
import { defineAction } from "./action";
import { ActionContext } from "./action/context";
import { defineGroup } from "./action/group";

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
    return (
      "Connect " + (integration.getAccounts().length == 0 ? "" : "more") + (ctx.isContextual ? "" : integration.name)
    );
  },
  icon: <IconPlus />,
  group: accountActionsGroup,
  canApply: (ctx) => {
    const integration = ctx.getTarget("integration");

    if (!integration) return false;

    return integration.getCanConnect?.() !== false;
  },
  async handler(ctx) {
    const integration = ctx.assertTarget("integration");

    return integration.connect();
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
    if (!(await showConfirmDialogRequest({ message: "Sure you want to log out?", confirmLabel: "Log out" }))) {
      return;
    }

    logoutBridge();
  },
});

export const restartAndClearElectronData = defineAction({
  name: "Restart app & Remove all data",
  icon: <IconRefreshCw />,
  group: accountActionsGroup,
  analyticsEvent: "App Restarted",
  keywords: ["reload", "restart"],
  async handler() {
    if (
      !(await showConfirmDialogRequest({
        message: "Sure you want to erase all app data?",
        confirmLabel: "Restart app data",
      }))
    ) {
      return;
    }
    clearAllDataRequest();
  },
});
