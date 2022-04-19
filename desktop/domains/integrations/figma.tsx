import React from "react";

import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { clearServiceCookiesBridge, figmaAuthTokenBridgeValue, loginFigmaBridge } from "@aca/desktop/bridge/auth";

import { IntegrationIcon } from "./IntegrationIcon";
import { IntegrationClient } from "./types";

const FIGMA_URL_SCHEME = "figma:/";
const figmaURL = "https://www.figma.com";

export const figmaIntegrationClient: IntegrationClient = {
  kind: "integration",
  notificationTypename: "notification_figma_comment",
  name: "Figma",
  description: "Get important updates and comments",
  getIsConnected: () => !!figmaAuthTokenBridgeValue.get(),
  getCanConnect: () => !figmaAuthTokenBridgeValue.get(),
  getAccounts: () => (figmaAuthTokenBridgeValue.get() ? [{ kind: "account", id: "figma", name: "Figma" }] : []),
  disconnect: async () => {
    figmaAuthTokenBridgeValue.reset();
    await clearServiceCookiesBridge({ url: figmaURL });
  },
  convertToLocalAppUrl: async ({ url }) => {
    return {
      protocol: "figma",
      localUrl: url.replace(figmaURL, FIGMA_URL_SCHEME),
      fallback: url,
    };
  },
  async connect() {
    await loginFigmaBridge();
  },
  icon: <IntegrationIcon imageUrl={integrationLogos.figma} />,
};
