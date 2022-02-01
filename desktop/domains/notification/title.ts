import { cachedComputed } from "@aca/clientdb";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";

export const getNotificationTitle = cachedComputed(function getNotificationTitle(
  notification: NotificationEntity
): string {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const innerNotification = notification.inner;

  if (!innerNotification) {
    return `Unknown notification`;
  }

  const type = innerNotification.__typename;

  switch (type) {
    case "notification_slack_message": {
      return `${innerNotification?.conversation_name}`;
    }
    case "notification_notion": {
      switch (innerNotification.type) {
        case "notification_notion_commented":
          return `Comment in "${innerNotification?.page_title}"`;
        case "notification_notion_user_invited":
          return `Invitation: "${innerNotification?.page_title}"`;
        case "notification_notion_user_mentioned":
          return `Mentioned you in "${innerNotification?.page_title}"`;
        default:
          return "New Notion notification";
      }
    }
    case "notification_figma_comment": {
      return `New ${innerNotification.is_mention ? "mention" : "comment"} in ${innerNotification?.file_name}`;
    }
    case "notification_linear": {
      return `${notification.from} commented in ${innerNotification?.issue_title}`;
    }
    default:
      return "Unhandled notification!!";
  }
});
