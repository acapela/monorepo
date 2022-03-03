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
      return `${innerNotification?.conversation_name}${innerNotification.slack_thread_ts ? " in Thread" : ""}`;
    }
    case "notification_notion": {
      switch (innerNotification.type) {
        case "notification_notion_commented":
          return `Commented in "${innerNotification?.page_title}"`;
        case "notification_notion_user_invited":
          return `Invited you to "${innerNotification?.page_title}"`;
        case "notification_notion_user_mentioned":
          return `Mentioned you in "${innerNotification?.page_title}"`;
        default:
          return "New Notion notification";
      }
    }
    case "notification_figma_comment": {
      return `${innerNotification.is_mention ? "Mentioned you" : "Comment"} in "${innerNotification?.file_name}"`;
    }
    case "notification_linear": {
      if (innerNotification.type === "Comment") {
        switch (innerNotification.origin) {
          case "mention":
            return `Mentioned you in "${innerNotification.issue_title}"`;
          default:
            return `Commented in "${innerNotification.issue_title}"`;
        }
      }
      switch (innerNotification.origin) {
        case "assign":
          return `The issue "${innerNotification.issue_title}" was assigned to you`;
        case "cancel":
        case "state:cancel":
          return `The issue "${innerNotification.issue_title}" was canceled`;
        case "state:complete":
          return `The issue "${innerNotification.issue_title}" was completed`;
        default:
          return `Created issue "${innerNotification.issue_title}"`;
      }
    }
    case "notification_jira_issue": {
      if (innerNotification.type === "comment_created") {
        return `Commented in "${innerNotification.issue_title}"`;
      }
      if (innerNotification.type === "user_mentioned") {
        return `Mentioned you in "${innerNotification.issue_title}"`;
      }
      return "Unhandled Jira Notification";
    }
    default:
      return "Unhandled notification!!";
  }
});
