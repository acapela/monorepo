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

import { defineAction } from "./action";

export const loginToAcapela = defineAction({
  name: "Log in",
  canApply: () => !authTokenBridgeValue.get(),
  handler() {
    loginBridge();
  },
});

export const connectGoogle = defineAction({
  name: "Connect Google",
  canApply: () => !googleAuthTokenBridgeValue.get(),
  handler() {
    loginGoogleBridge();
  },
});

export const connectSlack = defineAction({
  name: "Start Slack session",
  canApply: () => !slackAuthTokenBridgeValue.get(),
  handler() {
    loginSlackBridge();
  },
});

export const connectFigma = defineAction({
  name: "Connect Figma",
  canApply: () => !figmaAuthTokenBridgeValue.get(),
  handler() {
    loginFigmaBridge();
  },
});

export const connectNotion = defineAction({
  name: "Connect Notion",
  canApply: () => !notionAuthTokenBridgeValue.get(),
  handler() {
    loginNotionBridge();
  },
});
