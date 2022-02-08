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

import { defineAction } from "./action";
import { ActionContext } from "./action/context";
import { defineGroup } from "./action/group";

export const accountActionsGroup = defineGroup({
  name: "Account",
});

export function getContextualServiceName(name: string) {
  return (ctx: ActionContext) => (ctx.isContextual ? "Connect" : `Connect ${name}`);
}

export const loginToAcapela = defineAction({
  name: "Continue with Google",
  group: accountActionsGroup,
  icon: <GoogleGLogoIcon />,
  canApply: () => !authTokenBridgeValue.get(),
  handler() {
    loginBridge();
  },
});

export const connectGoogle = defineAction({
  name: getContextualServiceName("Google"),
  icon: <GoogleGLogoIcon />,
  group: accountActionsGroup,
  canApply: () => !googleAuthTokenBridgeValue.get(),
  handler() {
    loginGoogleBridge();
  },
});

export const connectFigma = defineAction({
  name: getContextualServiceName("Figma"),
  icon: <IconPlus />,
  group: accountActionsGroup,
  canApply: () => !figmaAuthTokenBridgeValue.get(),
  handler() {
    loginFigmaBridge();
  },
});

export const connectNotion = defineAction({
  name: getContextualServiceName("Notion"),
  icon: <IconPlus />,
  group: accountActionsGroup,
  canApply: () => !notionAuthTokenBridgeValue.get(),
  handler() {
    loginNotionBridge();
  },
});

export const connectLinear = defineAction({
  name: getContextualServiceName("Linear"),
  icon: <IconPlus />,
  canApply: () => !linearAuthTokenBridgeValue.get(),
  handler() {
    loginLinearBridge();
  },
});

export const restartAndClearElectronData = defineAction({
  name: "Log out",
  icon: <IconLogOut />,
  group: accountActionsGroup,
  keywords: ["reload"],
  handler() {
    clearAllDataRequest();
  },
});
