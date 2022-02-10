import React from "react";

import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { getIsAppInstalledLocally } from "@aca/desktop/bridge/apps";
import { clearServiceCookiesBridge, figmaAuthTokenBridgeValue, loginFigmaBridge } from "@aca/desktop/bridge/auth";

import { IntegrationIcon } from "./IntegrationIcon";
import { IntegrationClient } from "./types";

const FIGMA_URL_SCHEME = "figma:/";
const figmaURL = "https://www.figma.com";

export const figmaIntegrationClient: IntegrationClient = {
  kind: "integration",
  name: "Figma",
  description: "Get important updates and comments",
  getIsConnected: () => !!figmaAuthTokenBridgeValue.get(),
  disconnect: async () => {
    figmaAuthTokenBridgeValue.reset();
    await clearServiceCookiesBridge({ url: figmaURL });
  },
  convertToLocalAppUrl: async (url: string) => {
    const isAppInstalledLocally = await getIsAppInstalledLocally(FIGMA_URL_SCHEME);
    if (isAppInstalledLocally) {
      return url.replace(figmaURL, FIGMA_URL_SCHEME);
    }
    return url;
  },
  async connect() {
    await loginFigmaBridge();
  },
  icon: <IntegrationIcon imageUrl={integrationLogos.figma} />,
};
