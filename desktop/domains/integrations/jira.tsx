import { computed } from "mobx";
import React from "react";

import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { loginJiraBridge } from "@aca/desktop/bridge/auth";
import { accountStore } from "@aca/desktop/store/account";

import { IntegrationIcon } from "./IntegrationIcon";
import { IntegrationClient } from "./types";

function getAtlassianAccounts() {
  return (accountStore.user?.accounts ?? []).filter((account) => account.provider_id == "atlassian");
}

export const jiraIntegrationClient: IntegrationClient = {
  kind: "integration",
  notificationTypename: "notification_jira_issue",
  name: "Atlassian Jira",
  description: "Jira issue updates and comments",
  icon: <IntegrationIcon imageUrl={integrationLogos.jira} />,

  get isReady() {
    return computed(() => accountStore.user !== null);
  },
  getAccounts: () => (getAtlassianAccounts().length > 0 ? [{ kind: "account", id: "jira", name: "Jira" }] : []),
  getCanConnect() {
    return !!accountStore.user && getAtlassianAccounts().length == 0;
  },
  async connect() {
    loginJiraBridge();
  },
  async disconnect() {
    for (const account of getAtlassianAccounts()) {
      account.remove();
    }
  },
};
