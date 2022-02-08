import React from "react";

import {
  authTokenBridgeValue,
  figmaAuthTokenBridgeValue,
  googleAuthTokenBridgeValue,
  linearAuthTokenBridgeValue,
  loginBridge,
  loginFigmaBridge,
  loginGoogleBridge,
  loginLinearBridge,
  loginNotionBridge,
  notionAuthTokenBridgeValue,
} from "@aca/desktop/bridge/auth";
import { clearAllDataRequest } from "@aca/desktop/bridge/system";
import { IconLogOut, IconPlus } from "@aca/ui/icons";
import { GoogleGLogoIcon } from "@aca/ui/icons/logos/GoogleGLogo";
import { SlackLogo } from "@aca/ui/icons/logos/SlackLogo";

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

export const connectGoogle = defineAction({
  name: getContextualServiceName("Google"),
  icon: <GoogleGLogoIcon />,
  group: accountActionsGroup,
  canApply: () => !googleAuthTokenBridgeValue.get(),
  async handler() {
    await loginGoogleBridge();
  },
});

export const connectFigma = defineAction({
  name: getContextualServiceName("Figma"),
  icon: <IconPlus />,
  group: accountActionsGroup,
  canApply: () => !figmaAuthTokenBridgeValue.get(),
  analyticsEvent: "Figma Integration Added",
  async handler() {
    await loginFigmaBridge();
  },
});

export const connectNotion = defineAction({
  name: getContextualServiceName("Notion"),
  icon: <IconPlus />,
  group: accountActionsGroup,
  canApply: () => !notionAuthTokenBridgeValue.get(),
  analyticsEvent: "Notion Integration Added",
  async handler() {
    await loginNotionBridge();
  },
});

export const connectLinear = defineAction({
  name: getContextualServiceName("Linear"),
  icon: <IconPlus />,
  canApply: () => !linearAuthTokenBridgeValue.get(),
  analyticsEvent: "Linear Integration Added",
  async handler() {
    await loginLinearBridge();
  },
});

export const restartAndClearElectronData = defineAction({
  name: "Log out",
  icon: <IconLogOut />,
  group: accountActionsGroup,
  analyticsEvent: "Logged Out",
  keywords: ["reload"],
  async handler() {
    clearAllDataRequest();
  },
});
