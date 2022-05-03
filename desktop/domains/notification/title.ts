import { format } from "date-fns";

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
        case "notification_notion_reminder":
          return `Reminder in "${inner?.page_title}"`;
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
    case "notification_asana": {
      if (inner.type.startsWith("status:")) {
        const statusInfo = inner.type.split(":");
        if (statusInfo[1] === "mark") return `Marked "${inner.title}" as ${statusInfo[2]}`;
        return `Updated "${inner.title}" to "${statusInfo[1]}"`;
      }
      switch (inner.type) {
        case "mention":
          return `Mentioned you in "${inner.title}"`;
        case "comment":
          return `Commented in "${inner.title}"`;
        case "assign":
          return `Assigned you to "${inner.title}"`;
      }
      return `Unhandled Asana notification in "${inner.title}"`;
    }
    case "notification_drive": {
      switch (inner.type) {
        case "mention":
          return `Mentioned you in "${inner.documentName}"`;
        case "comment":
          return `Commented in "${inner.documentName}"`;
        case "invitation":
          return `Invited you to "${inner.documentName}"`;
        default:
          return inner.documentName ?? "Unknown document";
      }
    }
    case "notification_clickup": {
      if (inner.type.startsWith("due:")) {
        const statusInfo = inner.type.split(":");
        return `Set due date in "${inner.title}" to ${format(new Date(parseInt(statusInfo[1], 10)), "dd/MM/yyyy")}`;
      }
      if (inner.type.includes(":")) {
        const statusInfo = inner.type.split(":");
        return `Set ${statusInfo[0]} in "${inner.title}" to ${statusInfo[1]}`;
      }
      switch (inner.type) {
        case "mention":
          return `Mentioned you in "${inner.title}"`;
        case "comment":
          return `Commented in "${inner.title}"`;
        case "assign":
          return `Assigned you to "${inner.title}"`;
        case "task":
          return `Task "${inner.title}" was created`;
      }
      return `Unhandled ClickUp notification in "${inner.title}"`;
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
