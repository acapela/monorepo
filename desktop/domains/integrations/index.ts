import { unsafeAssertType } from "@aca/shared/assert";

import { figmaIntegrationClient } from "./figma";
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
};

export type SupportedIntegration = keyof typeof integrationClients;

export const integrationClientList = Object.values(integrationClients);

export function getIsIntegrationClient(item: unknown): item is IntegrationClient {
  unsafeAssertType<IntegrationClient>(item);

  return item && item.kind === "integration";
}
