import React from "react";

import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { clickupAuthTokenBridgeValue, loginClickUpBridge, logoutClickUpBridge } from "@aca/desktop/bridge/auth";

import { IntegrationIcon } from "./IntegrationIcon";
import { IntegrationClient } from "./types";

// import { getDb } from "@aca/desktop/clientdb";
// import { accountStore } from "@aca/desktop/store/account";

export const clickupIntegrationClient: IntegrationClient = {
  kind: "integration",
  notificationTypename: "notification_clickup",
  name: "ClickUp",
  description: "New tasks assignments, mentions, status updates and comments.",
  getIsConnected: () => !!clickupAuthTokenBridgeValue.get(),
  getCanConnect: () => true,
  getAccounts: () => [],
  // accountStore.user?.clickupWebhooks
  //   .sort((a, b) => a.workspace_name!.localeCompare(b.workspace_name!))
  //   .map((w) => ({
  //     kind: "account",
  //     id: w.id!,
  //     name: `${w.project_name} (${w.workspace_name})`,
  //   })) || [],
  convertToLocalAppUrl: async ({ url }) => ({
    // TODO: clickup app support
    fallback: url,
  }),
  async connect() {
    // const db = await getDb();
    // // wipe all webhooks as they get recreated on login
    // db.clickupWebhook.all.forEach((w) => w.remove("sync"));
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
