import { cachedComputed } from "@aca/clientdb";
import { unsafeAssertType } from "@aca/shared/assert";

import { acapelaIntegrationClient } from "./acapela";
import { asanaIntegrationClient } from "./asana";
import { clickupIntegrationClient } from "./clickup";
import { googleDriveIntegrationClient } from "./drive";
import { figmaIntegrationClient } from "./figma";
import { githubIntegrationClient } from "./github";
import { gmailIntegrationClient } from "./gmail";
import { jiraIntegrationClient } from "./jira";
import { linearIntegrationClient } from "./linear";
import { notionIntegrationClient } from "./notion";
import { slackIntegrationClient } from "./slack";
import { IntegrationClient } from "./types";

export const integrationClients = {
  acapela: acapelaIntegrationClient,
  slack: slackIntegrationClient,
  notion: notionIntegrationClient,
  figma: figmaIntegrationClient,
  linear: linearIntegrationClient,
  jira: jiraIntegrationClient,
  github: githubIntegrationClient,
  gmail: gmailIntegrationClient,
  asana: asanaIntegrationClient,
  drive: googleDriveIntegrationClient,
  clickup: clickupIntegrationClient,
};

export type SupportedIntegrationName = keyof typeof integrationClients;

export const integrationClientList = Object.values(integrationClients);
export const getEnabledIntegrationClientList = cachedComputed(() =>
  Object.values(integrationClients).filter((integration) => !integration.isHiddenFromSettings)
);

export const getIntegrationAccountComposers = cachedComputed(
  (clients: IntegrationClient[] = getEnabledIntegrationClientList()) =>
    clients.flatMap((client) => {
      const accounts = new Map(client.getAccounts().map((account) => [account.id, account]));
      const composeURLs = client.getComposeURLs?.() ?? [];
      return composeURLs.map(({ accountId, url }) => ({ client, account: accounts.get(accountId)!, url }));
    })
);

export function getIsIntegrationClient(item: unknown): item is IntegrationClient {
  unsafeAssertType<IntegrationClient>(item);

  return item && item.kind === "integration";
}
