import React from "react";

import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { clickupAuthTokenBridgeValue, loginClickUpBridge, logoutClickUpBridge } from "@aca/desktop/bridge/auth";
// import { getDb } from "@aca/desktop/clientdb";
import { accountStore } from "@aca/desktop/store/account";

import { IntegrationIcon } from "./IntegrationIcon";
import { IntegrationClient } from "./types";

export const clickupIntegrationClient: IntegrationClient = {
  kind: "integration",
  notificationTypename: "notification_clickup",
  name: "ClickUp",
  description: "New tasks assignments, mentions, status updates and comments.",
  getIsConnected: () => !!clickupAuthTokenBridgeValue.get(),
  getCanConnect: () => true,
  getAccounts: () =>
    accountStore.user?.clickupTeams
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((w) => ({
        kind: "account",
        id: w.id,
        name: `${w.name}`,
      })) || [],
  convertToLocalAppUrl: async ({ url }) => ({
    // TODO: clickup app support
    fallback: url,
  }),
  async connect() {
    // wipe all teams as they get recreated on login
    accountStore.user?.clickupTeams.forEach((w) => w.remove("sync"));
    await loginClickUpBridge();
  },
  async disconnect() {
    // const db = await getDb();
    // await logoutClickUpBridge({ webhookId: db.clickupWebhook.all.length > 1 ? id : undefined });
    // db.clickupWebhook.removeById(id, "sync");
    await logoutClickUpBridge();
  },
  icon: <IntegrationIcon imageUrl={integrationLogos.clickup} />,
};
