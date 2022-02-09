import React from "react";

import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { figmaAuthTokenBridgeValue, loginFigmaBridge } from "@aca/desktop/bridge/auth";

import { IntegrationIcon } from "./IntegrationIcon";
import { IntegrationClient } from "./types";

export const figmaIntegrationClient: IntegrationClient = {
  kind: "integration",
  name: "Figma",
  description: "Get important updates and comments",
  getIsConnected: () => !!figmaAuthTokenBridgeValue.get(),
  async connect() {
    await loginFigmaBridge();
  },
  icon: <IntegrationIcon imageUrl={integrationLogos.figma} />,
};
