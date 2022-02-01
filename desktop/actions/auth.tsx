import React from "react";

import { loginBridge, loginSlackBridge, slackAuthTokenBridgeValue } from "@aca/desktop/bridge/auth";
import {
  authTokenBridgeValue,
  figmaAuthTokenBridgeValue,
  googleAuthTokenBridgeValue,
  loginFigmaBridge,
  loginGoogleBridge,
  loginNotionBridge,
  notionAuthTokenBridgeValue,
} from "@aca/desktop/bridge/auth";
import { IconAtom, IconLogIn, IconLogOut } from "@aca/ui/icons";

import { clearAllDataRequest } from "../bridge/system";
import { defineAction } from "./action";
import { defineGroup } from "./action/group";

export const accountActionsGroup = defineGroup({
  name: "Account",
});

export const loginToAcapela = defineAction({
  name: "Log in",
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

export const connectSlack = defineAction({
  name: "Start Slack session",
  icon: <IconAtom />,
  group: accountActionsGroup,
  canApply: () => !slackAuthTokenBridgeValue.get(),
  handler() {
    loginSlackBridge();
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

export const restartAndClearElectronData = defineAction({
  name: "Log out",
  icon: <IconLogOut />,
  group: accountActionsGroup,
  keywords: ["reload"],
  handler() {
    clearAllDataRequest();
  },
});
