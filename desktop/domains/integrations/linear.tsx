import React from "react";

import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { linearAuthTokenBridgeValue, loginLinearBridge } from "@aca/desktop/bridge/auth";

import { IntegrationIcon } from "./IntegrationIcon";
import { IntegrationClient } from "./types";

const LINEAR_URL_SCHEME = "linear:/";
const linearURL = "https://linear.app";

export const linearIntegrationClient: IntegrationClient = {
  kind: "integration",
  notificationTypename: "notification_linear",
  name: "Linear",
  description: "New issues, task assignments and comments.",
  isReady: linearAuthTokenBridgeValue.observables.isReady,
  getCanConnect: () => !linearAuthTokenBridgeValue.get(),
  getConnections: () => (linearAuthTokenBridgeValue.get() ? [{ id: "linear", title: "Linear" }] : []),
  convertToLocalAppUrl: async ({ url }) => {
    return {
      protocol: "linear",
      localUrl: url.replace(linearURL, LINEAR_URL_SCHEME),
      fallback: url,
    };
  },
  async connect() {
    await loginLinearBridge();
  },
  async disconnect() {
    await loginLinearBridge({ logout: true });
  },
  icon: <IntegrationIcon imageUrl={integrationLogos.linear} />,
};
