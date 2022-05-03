import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { loginJiraBridge } from "@aca/desktop/bridge/auth";
import { accountStore } from "@aca/desktop/store/account";

import { IntegrationClient } from "./types";

function getAtlassianAccounts() {
  return (accountStore.user?.accounts ?? []).filter((account) => account.provider_id == "atlassian");
}

export const jiraIntegrationClient: IntegrationClient = {
  kind: "integration",
  notificationTypename: "notification_jira_issue",
  name: "Jira",
  description: "Jira issue updates and comments",
  imageURL: integrationLogos.jira,
  getIsConnected: () => {
    return !!accountStore.user && getAtlassianAccounts().length > 0;
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
