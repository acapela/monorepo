import { autorun, computed } from "mobx";
import React from "react";

import { trackEvent } from "@aca/desktop/analytics";
import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { clearServiceCookiesBridge, openBrowserWindow } from "@aca/desktop/bridge/auth";
import { FRONTEND_URL } from "@aca/desktop/lib/env";
import { accountStore } from "@aca/desktop/store/account";

import { IntegrationIcon } from "./IntegrationIcon";
import { IntegrationClient } from "./types";

function getAtlassianAccounts() {
  return (accountStore.user?.accounts ?? []).filter((account) => account.provider_id == "atlassian");
}

const getIsConnected = () => getAtlassianAccounts().length > 0;

export const atlassianIntegrationClient: IntegrationClient = {
  kind: "integration",
  notificationTypename: "notification_jira_issue",
  name: "Jira",
  description: "Issues and comments.",
  icon: <IntegrationIcon imageUrl={integrationLogos.jira} />,

  get isReady() {
    return computed(() => accountStore.user !== null);
  },
  getIsConnected,
  getCanConnect: () => !!accountStore.user,
  async connect() {
    const closeAtlassianInstallWindow = await openBrowserWindow({ url: FRONTEND_URL + "/auth/atlassian" });

    return new Promise<void>((resolve) => {
      const stop = autorun(() => {
        if (getIsConnected()) {
          if (closeAtlassianInstallWindow) {
            closeAtlassianInstallWindow();
            trackEvent("Slack Integration Added");
          }
          stop();
          resolve();
        }
      });
    });
  },
  async disconnect() {
    await clearServiceCookiesBridge({ url: "https://atlassian.com" });
    for (const account of getAtlassianAccounts()) {
      account.remove();
    }
  },
};
