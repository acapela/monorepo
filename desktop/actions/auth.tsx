import { loginBridge } from "@aca/desktop/bridge/auth";
import {
  authTokenBridgeValue,
  figmaAuthTokenBridgeValue,
  googleAuthTokenBridgeValue,
  loginFigmaBridge,
  loginGoogleBridge,
  loginNotionBridge,
  loginSlackBridge,
  notionAuthTokenBridgeValue,
  slackAuthTokenBridgeValue,
} from "@aca/desktop/bridge/auth";

import { clearAllDataRequest } from "../bridge/system";
import { defineAction } from "./action";
import { defineGroup } from "./action/group";

export const accountActionsGroup = defineGroup({
  name: "Account",
});

export const loginToAcapela = defineAction({
  name: "Log in",
  group: accountActionsGroup,
  canApply: () => !authTokenBridgeValue.get(),
  handler() {
    loginBridge();
  },
});

export const connectGoogle = defineAction({
  name: "Connect Google",
  group: accountActionsGroup,
  canApply: () => !googleAuthTokenBridgeValue.get(),
  handler() {
    loginGoogleBridge();
  },
});

export const connectSlack = defineAction({
  name: "Start Slack session",
  group: accountActionsGroup,
  canApply: () => !slackAuthTokenBridgeValue.get(),
  handler() {
    loginSlackBridge();
  },
});

export const connectFigma = defineAction({
  name: "Connect Figma",
  group: accountActionsGroup,
  canApply: () => !figmaAuthTokenBridgeValue.get(),
  handler() {
    loginFigmaBridge();
  },
});

export const connectNotion = defineAction({
  name: "Connect Notion",
  group: accountActionsGroup,
  canApply: () => !notionAuthTokenBridgeValue.get(),
  handler() {
    loginNotionBridge();
  },
});

export const restartAndClearElectronData = defineAction({
  name: "Log out",
  group: accountActionsGroup,
  keywords: ["reload"],
  shortcut: ["Mod", "Shift", "C"],
  handler() {
    clearAllDataRequest();
  },
});
