import { cachedComputed } from "@aca/clientdb";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { integrationClients } from "@aca/desktop/domains/integrations";

function getTitle(inner: NotificationEntity["inner"]): string {
  if (!inner) {
    return `Unknown notification`;
  }

  const type = inner.__typename;

  switch (type) {
    case "notification_slack_message": {
      const name = inner.conversation_type == "channel" ? inner?.conversation_name : "";
      const threadLabel = inner.slack_thread_ts ? `Thread${name ? " in " : ""}` : "";
      return threadLabel + name;
    }
    case "notification_notion": {
      switch (inner.type) {
        case "notification_notion_commented":
          return `Commented in "${inner?.page_title}"`;
        case "notification_notion_user_invited":
          return `Invited you to "${inner?.page_title}"`;
        case "notification_notion_user_mentioned":
          return `Mentioned you in "${inner?.page_title}"`;
        default:
          return "New Notion notification";
      }
    }
    case "notification_figma_comment": {
      return `${inner.is_mention ? "Mentioned you" : "Comment"} in "${inner?.file_name}"`;
    }
    case "notification_linear": {
      if (inner.type === "Comment") {
        switch (inner.origin) {
          case "mention":
            return `Mentioned you in "${inner.issue_title}"`;
          default:
            return `Commented in "${inner.issue_title}"`;
        }
      }
      switch (inner.origin) {
        case "assign":
          return `Assigned you to "${inner.issue_title}"`;
        case "cancel":
        case "state:cancel":
          return `Cancelled issue "${inner.issue_title}"`;
        case "state:complete":
          return `Completed issue "${inner.issue_title}"`;
        default:
          return `Created issue "${inner.issue_title}"`;
      }
    }
    case "notification_jira_issue": {
      if (inner.type === "comment_created") {
        return `Commented in "${inner.issue_title}"`;
      }
      if (inner.type === "user_mentioned") {
        return `Mentioned you in "${inner.issue_title}"`;
      }
      if (inner.type === "issue_status_updated") {
        return `Updated "${inner.issue_title}" to "${inner.to}"`;
      }
      if (inner.type === "issue_assigned") {
        return `Assigned you to "${inner.issue_title}"`;
      }
      return "Unhandled Jira Notification";
    }
    case "notification_github": {
      switch (inner.type) {
        case "mention":
          return `Mentioned you in "${inner.title}"`;
        case "assign":
          return `Assigned you to "${inner.title}"`;
        case "review":
          return `Review requested for "${inner.title}"`;
      }
      return `Unhandled notification in "${inner.title}"`;
    }
    case "notification_gmail": {
      return "";
    }
    default:
      return "Unhandled notification!!";
  }
}

export const getNotificationTitle = cachedComputed((notification: NotificationEntity): string => {
  const { inner } = notification;
  const client = Object.values(integrationClients).find((client) => client.notificationTypename == inner?.__typename);
  const hasMultipleWorkspaces = (client?.getAccounts().length ?? 0) > 1 || (client?.getWorkspaces?.().length ?? 0) > 1;
  const workspaceName = hasMultipleWorkspaces && inner && "workspaceName" in inner && inner.workspaceName;
  const title = getTitle(inner);
  return title + (workspaceName ? (title ? " in " : "") + workspaceName : "");
});
