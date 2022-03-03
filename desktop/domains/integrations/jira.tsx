import { computed } from "mobx";
import React from "react";

import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { clearServiceCookiesBridge, jiraAuthTokenBridgeValue, loginJiraBridge } from "@aca/desktop/bridge/auth";
import { accountStore } from "@aca/desktop/store/account";

import { IntegrationIcon } from "./IntegrationIcon";
import { IntegrationClient } from "./types";

export const jiraIntegrationClient: IntegrationClient = {
  kind: "integration",
  notificationTypename: "notification_jira_issue",
  name: "Atlassian Jira",
  description: "Jira issue updates and comments",
  icon: <IntegrationIcon imageUrl={integrationLogos.jira} />,

  get isReady() {
    return computed(() => accountStore.user !== null);
  },
  getIsConnected: () => {
    return jiraAuthTokenBridgeValue.get();
  },
  getCanConnect() {
    return !!accountStore.user;
  },
  async connect() {
    loginJiraBridge();
  },
  async disconnect() {
    await clearServiceCookiesBridge({ url: "https://atlassian.com" });
  },
};
