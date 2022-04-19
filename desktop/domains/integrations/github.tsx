import React from "react";

import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { githubAuthTokenBridgeValue, loginGitHubBridge } from "@aca/desktop/bridge/auth";
import { getDb } from "@aca/desktop/clientdb";

import { IntegrationIcon } from "./IntegrationIcon";
import { IntegrationClient } from "./types";

export const githubIntegrationClient: IntegrationClient = {
  kind: "integration",
  notificationTypename: "notification_github",
  name: "GitHub",
  description: "New issues, comments and mentions.",
  getIsConnected: () => !!githubAuthTokenBridgeValue.get(),
  getCanConnect: () => true,
  getAccounts: () => {
    const db = getDb();
    return githubAuthTokenBridgeValue.get()
      ? db.githubInstallation.all.map((i) => ({
          kind: "account",
          id: `${i.id}:${i.installation_id}`,
          name: `${i.account_login}${i.target_type === "Organization" ? " (Organization)" : ""}`,
        }))
      : [];
  },
  async connect() {
    await loginGitHubBridge();
  },
  async disconnect(accountId) {
    const [id, installationId] = accountId.split(":");
    const db = getDb();
    await loginGitHubBridge({
      logout: true,
      installationId: db.githubInstallation.all.length > 1 ? parseInt(installationId, 10) : undefined,
    });
    db.githubInstallation.removeById(id, "sync");
  },
  icon: <IntegrationIcon imageUrl={integrationLogos.github} />,
};
