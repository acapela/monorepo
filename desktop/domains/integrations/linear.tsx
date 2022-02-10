import React from "react";

import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { getIsAppInstalledLocally } from "@aca/desktop/bridge/apps";
import { linearAuthTokenBridgeValue, loginLinearBridge } from "@aca/desktop/bridge/auth";

import { IntegrationIcon } from "./IntegrationIcon";
import { IntegrationClient } from "./types";

const LINEAR_URL_SCHEME = "linear:/";
const linearURL = "https://linear.app";

export const linearIntegrationClient: IntegrationClient = {
  kind: "integration",
  name: "Linear",
  description: "New issues, task assignments and comments.",
  getIsConnected: () => !!linearAuthTokenBridgeValue.get(),
  convertToLocalAppUrl: async (url: string) => {
    const isAppInstalledLocally = await getIsAppInstalledLocally(LINEAR_URL_SCHEME);
    if (isAppInstalledLocally) {
      return url.replace(linearURL, LINEAR_URL_SCHEME);
    }
    return url;
  },
  async connect() {
    await loginLinearBridge();
  },
  icon: <IntegrationIcon imageUrl={integrationLogos.linear} />,
};
