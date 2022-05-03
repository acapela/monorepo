import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { asanaAuthTokenBridgeValue, loginAsanaBridge, logoutAsanaBridge } from "@aca/desktop/bridge/auth";
import { getDb } from "@aca/desktop/clientdb";
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
  imageURL: integrationLogos.asana,
};
