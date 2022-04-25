import { cachedComputed } from "@aca/clientdb";
import { unsafeAssertType } from "@aca/shared/assert";

import { asanaIntegrationClient } from "./asana";
import { figmaIntegrationClient } from "./figma";
import { githubIntegrationClient } from "./github";
import { gmailIntegrationClient } from "./gmail";
import { jiraIntegrationClient } from "./jira";
import { linearIntegrationClient } from "./linear";
import { notionIntegrationClient } from "./notion";
import { slackIntegrationClient } from "./slack";
import { IntegrationClient } from "./types";

export const integrationClients = {
  slack: slackIntegrationClient,
  notion: notionIntegrationClient,
  figma: figmaIntegrationClient,
  linear: linearIntegrationClient,
  jira: jiraIntegrationClient,
  github: githubIntegrationClient,
  gmail: gmailIntegrationClient,
  asana: asanaIntegrationClient,
};

export type SupportedIntegrationName = keyof typeof integrationClients;

export const integrationClientList = Object.values(integrationClients);
export const getEnabledIntegrationClientList = cachedComputed(() =>
  Object.values(integrationClients).filter((integration) => !integration.getIsDisabled?.())
);

export function getIsIntegrationClient(item: unknown): item is IntegrationClient {
  unsafeAssertType<IntegrationClient>(item);

  return item && item.kind === "integration";
}
