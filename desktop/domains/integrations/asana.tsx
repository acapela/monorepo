import React from "react";

import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { asanaAuthTokenBridgeValue, loginAsanaBridge, logoutAsanaBridge } from "@aca/desktop/bridge/auth";
import { accountStore } from "@aca/desktop/store/account";

import { IntegrationIcon } from "./IntegrationIcon";
import { IntegrationClient } from "./types";

const URL_SCHEME = "asana:/";
const ROOT_URL = "https://app.asana.com";

export const asanaIntegrationClient: IntegrationClient = {
  kind: "integration",
  notificationTypename: "notification_asana",
  name: "Asana",
  description: "New issues, task assignments and comments.",
  isReady: asanaAuthTokenBridgeValue.observables.isReady,
  getCanConnect: () => true,
  getAccounts: () =>
    accountStore.user?.asanaWebhooks.map((w) => ({ kind: "account", id: "asana", name: w.project_name! })) || [],
  convertToLocalAppUrl: async ({ url }) => ({
    protocol: "asana",
    localUrl: url.replace(ROOT_URL, URL_SCHEME),
    fallback: url,
  }),
  async connect() {
    await loginAsanaBridge();
  },
  async disconnect() {
    await logoutAsanaBridge();
  },
  icon: <IntegrationIcon imageUrl={integrationLogos.asana} />,
};
