import { unsafeAssertType } from "@aca/shared/assert";

import { jiraIntegrationClient } from "./atlassian";
import { figmaIntegrationClient } from "./figma";
import { linearIntegrationClient } from "./linear";
import { notionIntegrationClient } from "./notion";
import { slackIntegrationClient } from "./slack";
import { IntegrationClient } from "./types";

export const integrationClients = {
  jira: jiraIntegrationClient,
  slack: slackIntegrationClient,
  notion: notionIntegrationClient,
  figma: figmaIntegrationClient,
  linear: linearIntegrationClient,
};

export type SupportedIntegration = keyof typeof integrationClients;

export const integrationClientList = Object.values(integrationClients);

export function getIsIntegrationClient(item: unknown): item is IntegrationClient {
  unsafeAssertType<IntegrationClient>(item);

  return item && item.kind === "integration";
}
