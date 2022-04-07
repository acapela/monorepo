import React from "react";

import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { asanaAuthTokenBridgeValue, loginAsanaBridge } from "@aca/desktop/bridge/auth";

import { IntegrationIcon } from "./IntegrationIcon";
import { IntegrationClient } from "./types";

const LINEAR_URL_SCHEME = "asana:/";
const asanaURL = "https://app.asana.com";

export const asanaIntegrationClient: IntegrationClient = {
  kind: "integration",
  notificationTypename: "notification_asana",
  name: "Asana",
  description: "New issues, task assignments and comments.",
  isReady: asanaAuthTokenBridgeValue.observables.isReady,
  getCanConnect: () => !asanaAuthTokenBridgeValue.get(),
  getAccounts: () => (asanaAuthTokenBridgeValue.get() ? [{ kind: "account", id: "asana", name: "Asana" }] : []),
  convertToLocalAppUrl: async ({ url }) => {
    return {
      protocol: "asana",
      localUrl: url.replace(asanaURL, LINEAR_URL_SCHEME),
      fallback: url,
    };
  },
  async connect() {
    await loginAsanaBridge();
  },
  async disconnect() {
    await loginAsanaBridge({ logout: true });
  },
  icon: <IntegrationIcon imageUrl={integrationLogos.asana} />,
};
