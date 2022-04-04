import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { SupportedIntegration, getIsIntegrationClient, integrationClients } from "@aca/desktop/domains/integrations";
import { IntegrationClient } from "@aca/desktop/domains/integrations/types";

const notionType = ["notification_notion"] as const;
const figmaType = ["notification_figma_comment"] as const;
const slackType = ["notification_slack_message"] as const;
const linearType = ["notification_linear"] as const;
const jiraType = ["notification_jira_issue"] as const;
const githubType = ["notification_github"] as const;

const supportedNotificationTypes = [notionType, figmaType, slackType, linearType, jiraType, githubType].flat();
type SupportedNotificationTypes = typeof supportedNotificationTypes[number];

export const integrationNotificationMap: Record<SupportedIntegration, SupportedNotificationTypes[]> = {
  notion: ["notification_notion"],
  figma: ["notification_figma_comment"],
  slack: ["notification_slack_message"],
  linear: ["notification_linear"],
  jira: ["notification_jira_issue"],
  github: ["notification_github"],
};

const log = makeLogger("Integration-Mapper");

export function getIntegration(notificationType: SupportedNotificationTypes): IntegrationClient | undefined {
  for (const [key, value] of Object.entries(integrationNotificationMap)) {
    if (value.some((v) => v === notificationType)) {
      const integration = integrationClients[key as SupportedIntegration];

      if (!getIsIntegrationClient(integration)) {
        log.error(
          `"${key}" integration included in "integrationNotificationMap" but not in "integrationClients". Probably a typo`
        );
        return;
      }
      return integration;
    }
  }

  log.error(`integration for "${notificationType}" not properly mapped`);
}
