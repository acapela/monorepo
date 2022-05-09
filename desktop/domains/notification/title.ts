import { format } from "date-fns";

import { cachedComputed } from "@aca/clientdb";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { integrationClients } from "@aca/desktop/domains/integrations";
import { jiraIssueFieldAlias } from "@aca/shared/attlassian";

function getTitle(inner: NotificationEntity["inner"], isGroupItem: boolean): string {
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
          return isGroupItem ? "Commented" : `Commented in "${inner?.page_title}"`;
        case "notification_notion_user_invited":
          return isGroupItem ? "Invited you" : `Invited you to "${inner?.page_title}"`;
        case "notification_notion_user_mentioned":
          return isGroupItem ? "Mentioned you" : `Mentioned you in "${inner?.page_title}"`;
        case "notification_notion_reminder":
          return isGroupItem ? "Reminder" : `Reminder in "${inner?.page_title}"`;
        default:
          return "New notification";
      }
    }
    case "notification_figma_comment": {
      return `${inner.is_mention ? "Mentioned you" : "Comment"}${isGroupItem ? "" : ` in "${inner?.file_name}"`}`;
    }
    case "notification_linear": {
      if (inner.type === "Comment") {
        switch (inner.origin) {
          case "mention":
            return isGroupItem ? "Mentioned you" : `Mentioned you in "${inner.issue_title}"`;
          default:
            return isGroupItem ? "Commented" : `Commented in "${inner.issue_title}"`;
        }
      }
      switch (inner.origin) {
        case "assign":
          return isGroupItem ? "Assigned you" : `Assigned you to "${inner.issue_title}"`;
        case "cancel":
        case "state:cancel":
          return isGroupItem ? "Cancelled issue" : `Cancelled issue "${inner.issue_title}"`;
        case "state:complete":
          return isGroupItem ? "Completed issue" : `Completed issue "${inner.issue_title}"`;
        default:
          return isGroupItem ? "Created issue" : `Created issue "${inner.issue_title}"`;
      }
    }
    case "notification_jira_issue": {
      if (inner.type === "comment_created") {
        return isGroupItem ? "Commented" : `Commented in "${inner.issue_title}"`;
      }
      if (inner.type === "user_mentioned") {
        return isGroupItem ? "Mentioned you" : `Mentioned you in "${inner.issue_title}"`;
      }
      if (inner.type === "issue_status_updated") {
        return isGroupItem ? `Updated to "${inner.to}"` : `Updated "${inner.issue_title}" to "${inner.to}"`;
      }
      if (inner.type === "issue_assigned") {
        return isGroupItem ? `Assigned you` : `Assigned you to "${inner.issue_title}"`;
      }
      if (inner.type === "issue_field_updated") {
        const field = jiraIssueFieldAlias[inner.updated_issue_field ?? ""] ?? inner.updated_issue_field;

        if (!field) {
          return isGroupItem ? `New Update` : `Updated ${inner.issue_title}`;
        }

        if (!!inner.from && !inner.to) {
          return isGroupItem ? `Removed '${field}'` : `Removed '${field}' from ${inner.issue_title}`;
        }

        if (!inner.from && !!inner.to) {
          return isGroupItem
            ? `Added "${inner.to}" as '${field}'`
            : `Added "${inner.to}" as '${field}' in ${inner.issue_title}`;
        }

        if (!!inner.from && !!inner.to) {
          return isGroupItem
            ? `Updated '${field}' to "${inner.to}"`
            : `Updated '${field}' to "${inner.to}" in ${inner.issue_title}`;
        }
      }
      return "Unhandled Jira Notification";
    }
    case "notification_github": {
      switch (inner.type) {
        case "mention":
          return isGroupItem ? "Mentioned you" : `Mentioned you in "${inner.title}"`;
        case "assign":
          return isGroupItem ? "Assigned you" : `Assigned you to "${inner.title}"`;
        case "review":
          return isGroupItem ? "Review requested" : `Review requested for "${inner.title}"`;
      }
      return `Unhandled notification in "${inner.title}"`;
    }
    case "notification_gmail": {
      return "";
    }
    case "notification_asana": {
      if (inner.type.startsWith("status:")) {
        const statusInfo = inner.type.split(":");
        if (statusInfo[1] === "mark") {
          return isGroupItem ? `Marked as ${statusInfo[2]}` : `Marked "${inner.title}" as ${statusInfo[2]}`;
        }
        return isGroupItem ? `Updated to "${statusInfo[1]}"` : `Updated "${inner.title}" to "${statusInfo[1]}"`;
      }
      switch (inner.type) {
        case "mention":
          return isGroupItem ? "Mentioned you" : `Mentioned you in "${inner.title}"`;
        case "comment":
          return isGroupItem ? "Commented" : `Commented in "${inner.title}"`;
        case "assign":
          return isGroupItem ? "Assigned you" : `Assigned you to "${inner.title}"`;
      }
      return `Unhandled Asana notification in "${inner.title}"`;
    }
    case "notification_drive": {
      switch (inner.type) {
        case "mention":
          return isGroupItem ? "Mentioned you" : `Mentioned you in "${inner.documentName}"`;
        case "comment":
          return isGroupItem ? "Commented" : `Commented in "${inner.documentName}"`;
        case "invitation":
          return isGroupItem ? "Invited you" : `Invited you to "${inner.documentName}"`;
        default:
          return inner.documentName ?? "Unknown document";
      }
    }
    case "notification_clickup": {
      if (inner.type.startsWith("due:")) {
        const statusInfo = inner.type.split(":");
        return `Set due date${isGroupItem ? "" : ` in "${inner.title}"`} to ${format(
          new Date(parseInt(statusInfo[1], 10)),
          "dd/MM/yyyy"
        )}`;
      }
      if (inner.type.includes(":")) {
        const statusInfo = inner.type.split(":");
        return `Set ${statusInfo[0]}${isGroupItem ? "" : ` in "${inner.title}"`} to ${statusInfo[1]}`;
      }
      switch (inner.type) {
        case "mention":
          return `Mentioned you${isGroupItem ? "" : ` in "${inner.title}"`}`;
        case "comment":
          return `Commented${isGroupItem ? "" : ` in "${inner.title}"`}`;
        case "assign":
          return `Assigned you${isGroupItem ? "" : ` to "${inner.title}"`}`;
        case "task":
          return `Created "${inner.title}" task`;
      }
      return `Unhandled ClickUp notification in "${inner.title}"`;
    }
    default:
      return "Unhandled notification!!";
  }
}

export const getNotificationTitle = cachedComputed(
  (notification: NotificationEntity, isGroupItem?: boolean): string => {
    const { inner } = notification;
    const client = Object.values(integrationClients).find((client) => client.notificationTypename == inner?.__typename);
    const hasMultipleWorkspaces =
      (client?.getAccounts().length ?? 0) > 1 || (client?.getWorkspaces?.().length ?? 0) > 1;
    const workspaceName = hasMultipleWorkspaces && inner && "workspaceName" in inner && inner.workspaceName;
    const title = getTitle(inner, !!isGroupItem);
    if (isGroupItem) {
      return title;
    }
    return title + (workspaceName ? (title ? " in " : "") + workspaceName : "");
  }
);
