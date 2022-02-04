import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { IntegrationType } from "@aca/desktop/domains/integrations/types";

export interface NotificationGroupTarget {
  id: string;
  name: string;
  integration: IntegrationType;
  integrationTitle: string;
}

const unknownTarget: NotificationGroupTarget = {
  id: "unknown",
  name: "Unknown",
  integration: "slack",
  integrationTitle: "Slack conversation",
};

export function getNotificationGroupTarget(notification: NotificationEntity): NotificationGroupTarget {
  const targetNotification = notification.inner;

  if (!targetNotification) return unknownTarget;

  if (targetNotification.__typename === "notification_figma_comment") {
    return {
      id: targetNotification.file_id,
      name: targetNotification.file_name,
      integration: "figma",
      integrationTitle: "Figma file",
    };
  }

  if (targetNotification.__typename === "notification_notion") {
    return {
      id: targetNotification.page_id,
      name: targetNotification.page_title,
      integration: "notion",
      integrationTitle: "Notion page",
    };
  }

  if (targetNotification.__typename === "notification_slack_message") {
    return {
      id: targetNotification.slack_conversation_id,
      name: targetNotification.conversation_name,
      integration: "slack",
      integrationTitle: "Slack conversation",
    };
  }

  return unknownTarget;
}
