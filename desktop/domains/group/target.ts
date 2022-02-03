import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { IntegrationType } from "@aca/desktop/domains/integrations/types";

export interface NotificationGroupTarget {
  id: string;
  name: string;
  integration: IntegrationType;
  integrationTitle: string;
}

export function getNotificationGroupTarget(notification: NotificationEntity): NotificationGroupTarget | null {
  const targetNotification = notification.inner;

  if (!targetNotification) return null;

  if (targetNotification.__typename === "notification_figma_comment") {
    return {
      id: targetNotification.file_id,
      name: targetNotification.file_name,
      integration: "figma",
      integrationTitle: "Figma",
    };
  }

  if (targetNotification.__typename === "notification_notion") {
    return {
      id: targetNotification.page_id,
      name: targetNotification.page_title,
      integration: "notion",
      integrationTitle: "Notion",
    };
  }

  if (targetNotification.__typename === "notification_slack_message") {
    return {
      id: targetNotification.slack_conversation_id,
      name: targetNotification.conversation_name,
      integration: "slack",
      integrationTitle: "Slack",
    };
  }

  console.warn(`Unrecognized notification target for grouping`);

  return null;
}
