import { cachedComputed } from "@aca/clientdb";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";

export const getNotificationTitle = cachedComputed(function getNotificationTitle(
  notification: NotificationEntity
): string {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const innerNotification = notification.inner!;
  const type = innerNotification.__typename;

  switch (type) {
    case "notification_slack_message": {
      return `${notification.from} in ${innerNotification?.conversation_name}`;
    }
    case "notification_notion": {
      switch (innerNotification.type) {
        case "notification_notion_commented":
          return `${notification.from} left a comment in ${innerNotification?.page_title}`;
        case "notification_notion_user_invited":
          return `${notification.from} invited you to ${innerNotification?.page_title}`;
        case "notification_notion_user_mentioned":
          return `${notification.from} mentioned you in ${innerNotification?.page_title}`;
        default:
          return "New Notion notification";
      }
    }
    case "notification_figma_comment": {
      return `${notification.from} ${innerNotification.is_mention ? "mentioned you" : "commented"} in ${
        innerNotification?.file_name
      }`;
    }
    default:
      return "Unhandled notification!!";
  }
});
