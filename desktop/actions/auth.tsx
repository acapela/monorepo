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
  name: "Log in",
  group: accountActionsGroup,
  icon: <IconLogIn />,
  canApply: () => {
    return !authTokenBridgeValue.get();
  },
  async handler() {
    await loginBridge();
  },
});

export const connectGoogle = defineAction({
  name: "Connect Google",
  icon: <IconAtom />,
  group: accountActionsGroup,
  canApply: () => !googleAuthTokenBridgeValue.get(),
  async handler() {
    await loginGoogleBridge();
  },
});

export const connectFigma = defineAction({
  name: "Connect Figma",
  icon: <IconAtom />,
  group: accountActionsGroup,
  canApply: () => !figmaAuthTokenBridgeValue.get(),
  analyticsEvent: "Figma Integration Added",
  async handler() {
    await loginFigmaBridge();
  },
});

export const connectNotion = defineAction({
  name: "Connect Notion",
  icon: <IconAtom />,
  group: accountActionsGroup,
  canApply: () => !notionAuthTokenBridgeValue.get(),
  analyticsEvent: "Notion Integration Added",
  async handler() {
    await loginNotionBridge();
  },
});

export const connectLinear = defineAction({
  name: "Connect Linear",
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
