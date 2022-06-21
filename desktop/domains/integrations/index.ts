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
  gmail: gmailIntegrationClient,
  drive: googleDriveIntegrationClient,
  slack: slackIntegrationClient,
  notion: notionIntegrationClient,
  figma: figmaIntegrationClient,
  linear: linearIntegrationClient,
  jira: jiraIntegrationClient,
  github: githubIntegrationClient,
  asana: asanaIntegrationClient,
  clickup: clickupIntegrationClient,
  acapela: acapelaIntegrationClient,
};

export type SupportedIntegrationName = keyof typeof integrationClients;

export const integrationClientList = Object.values(integrationClients);
export const getEnabledIntegrationClientList = cachedComputed(() =>
  Object.values(integrationClients).filter((integration) => !integration.isHiddenFromSettings)
);

export function getIsIntegrationClient(item: unknown): item is IntegrationClient {
  unsafeAssertType<IntegrationClient>(item);

  return item && item.kind === "integration";
}
