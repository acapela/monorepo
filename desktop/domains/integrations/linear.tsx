import React from "react";

import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { linearAuthTokenBridgeValue, loginLinearBridge } from "@aca/desktop/bridge/auth";

import { IntegrationIcon } from "./IntegrationIcon";
import { IntegrationClient } from "./types";

export const linearIntegrationClient: IntegrationClient = {
  kind: "integration",
  name: "Linear",
  description: "New issues, task assignments and comments.",
  getIsConnected: () => !!linearAuthTokenBridgeValue.get(),
  async connect() {
    await loginLinearBridge();
  },
  icon: <IntegrationIcon imageUrl={integrationLogos.linear} />,
};
