import React from "react";

import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { clearServiceCookiesBridge, figmaAuthTokenBridgeValue, loginFigmaBridge } from "@aca/desktop/bridge/auth";

import { IntegrationIcon } from "./IntegrationIcon";
import { IntegrationClient } from "./types";

export const figmaIntegrationClient: IntegrationClient = {
  kind: "integration",
  name: "Figma",
  description: "Get important updates and comments",
  getIsConnected: () => !!figmaAuthTokenBridgeValue.get(),
  disconnect: async () => {
    figmaAuthTokenBridgeValue.reset();
    await clearServiceCookiesBridge({ url: "https://www.figma.com" });
  },
  async connect() {
    await loginFigmaBridge();
  },
  icon: <IntegrationIcon imageUrl={integrationLogos.figma} />,
};
