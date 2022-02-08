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
import { IconAtom, IconLogIn, IconLogOut } from "@aca/ui/icons";

import { defineAction } from "./action";
import { defineGroup } from "./action/group";

export const accountActionsGroup = defineGroup({
  name: "Account",
});

export const loginToAcapela = defineAction({
  name: "Continue with Google",
  group: accountActionsGroup,
  icon: <IconLogIn />,
  canApply: () => !authTokenBridgeValue.get(),
  handler() {
    loginBridge();
  },
});

export const connectGoogle = defineAction({
  name: "Connect Google",
  icon: <IconAtom />,
  group: accountActionsGroup,
  canApply: () => !googleAuthTokenBridgeValue.get(),
  handler() {
    loginGoogleBridge();
  },
});

export const connectFigma = defineAction({
  name: "Connect Figma",
  icon: <IconAtom />,
  group: accountActionsGroup,
  canApply: () => !figmaAuthTokenBridgeValue.get(),
  handler() {
    loginFigmaBridge();
  },
});

export const connectNotion = defineAction({
  name: "Connect Notion",
  icon: <IconAtom />,
  group: accountActionsGroup,
  canApply: () => !notionAuthTokenBridgeValue.get(),
  handler() {
    loginNotionBridge();
  },
});

export const connectLinear = defineAction({
  name: "Connect Linear",
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
