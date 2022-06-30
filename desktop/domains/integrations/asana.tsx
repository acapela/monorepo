import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { asanaAuthTokenBridgeValue, loginAsanaBridge, logoutAsanaBridge } from "@aca/desktop/bridge/auth";
import { getDb } from "@aca/desktop/clientdb";
import { asanaWebhookEntity } from "@aca/desktop/clientdb/asanaWebhook";
import { accountStore } from "@aca/desktop/store/account";

import { IntegrationClient } from "./types";

export const asanaIntegrationClient: IntegrationClient = {
  kind: "integration",
  notificationTypename: "notification_asana",
  name: "Asana",
  description: "New tasks assignments, mentions, status updates and comments.",
  getIsConnected: () => !!asanaAuthTokenBridgeValue.get(),
  getCanConnect: () => true,
  getAccounts: () =>
    accountStore.user?.asanaWebhooks
      .slice()
      .sort((a, b) => a.workspace_name!.localeCompare(b.workspace_name!))
      .map((w) => ({
        kind: "account",
        id: w.id!,
        name: `${w.project_name} (${w.workspace_name})`,
      })) || [],
  convertToLocalAppUrl: async ({ url }) => ({
    // TODO: asana app support
    fallback: url,
  }),
  async connect() {
    const db = getDb();
    // wipe all webhooks as they get recreated on login
    db.entity(asanaWebhookEntity).all.forEach((w) => w.remove("sync"));
    await loginAsanaBridge();
  },
  async disconnect(id) {
    const db = getDb();
    await logoutAsanaBridge({ webhookId: db.entity(asanaWebhookEntity).all.length > 1 ? id : undefined });
    db.entity(asanaWebhookEntity).removeById(id, "sync");
  },
  imageURL: integrationLogos.asana,
};
