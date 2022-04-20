import React from "react";

import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { asanaAuthTokenBridgeValue, loginAsanaBridge, logoutAsanaBridge } from "@aca/desktop/bridge/auth";
import { getDb } from "@aca/desktop/clientdb";
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
    accountStore.user?.asanaWebhooks
      .sort((a, b) => a.workspace_name!.localeCompare(b.workspace_name!))
      .map((w) => ({
        kind: "account",
        id: w.id!,
        name: `${w.project_name} (${w.workspace_name})`,
      })) || [],
  convertToLocalAppUrl: async ({ url }) => ({
    protocol: "asana",
    localUrl: url.replace(ROOT_URL, URL_SCHEME),
    fallback: url,
  }),
  async connect() {
    const db = await getDb();
    // wipe all webhooks as they get recreated on login
    db.asanaWebhook.all.forEach((w) => w.remove("sync"));
    await loginAsanaBridge();
  },
  async disconnect(id) {
    const db = await getDb();
    await logoutAsanaBridge({ webhookId: db.asanaWebhook.all.length > 1 ? id : undefined });
    db.asanaWebhook.removeById(id, "sync");
  },
  icon: <IntegrationIcon imageUrl={integrationLogos.asana} />,
};
