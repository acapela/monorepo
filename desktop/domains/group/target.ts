import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { SupportedIntegration } from "@aca/desktop/domains/integrations";
import { getNotificationTitle } from "@aca/desktop/domains/notification/title";

export interface NotificationGroupTarget {
  id: string;
  name: string;
  integration: SupportedIntegration | "unknown";
  integrationTitle: string;
  isOnePreviewEnough?: boolean;
}

const unknownTarget: NotificationGroupTarget = {
  id: "unknown",
  name: "Unknown",
  integration: "unknown",
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
      id:
        targetNotification.slack_conversation_id +
        "#" +
        (targetNotification.slack_thread_ts ?? targetNotification.slack_message_ts),
      name: getNotificationTitle(notification),
      integration: "slack",
      integrationTitle: "Slack conversation",
      isOnePreviewEnough: true,
    };
  }

  if (targetNotification.__typename === "notification_linear") {
    return {
      id: targetNotification.issue_id,
      name: targetNotification.issue_title,
      integration: "linear",
      integrationTitle: "Linear issue",
    };
  }

  return unknownTarget;
}
