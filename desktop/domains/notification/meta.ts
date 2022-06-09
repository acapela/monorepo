import { cachedComputed } from "@aca/clientdb";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { integrationClients } from "@aca/desktop/domains/integrations";
import { jiraIssueFieldAlias } from "@aca/shared/attlassian";
import { niceFormatDate } from "@aca/shared/dates/format";
import { Falsy, isNotFalsy } from "@aca/shared/nullish";

import { NotificationTag, NotificationTagInput, getNotificationTag } from "./tag";

export interface NotificationMeta {
  title?: string | null;
  tags?: NotificationTag[];
}

function tags(...tagInputs: Array<NotificationTagInput | Falsy>): NotificationTag[] {
  return tagInputs.filter(isNotFalsy).map(getNotificationTag);
}

// →

function updateLabel(thing: string, value?: string | null) {
  return `${thing} updated → ${value}`;
}

function getNotificationMetaWithoutWorkspace(notification: NotificationEntity): NotificationMeta {
  const { inner, text_preview: title } = notification;

  if (!inner) {
    return { title: "New notification" };
  }

  const type = inner.__typename;

  switch (type) {
    case "notification_slack_message": {
      const { conversation_name, conversation_type, is_mention, slack_thread_ts } = inner;

      const isThread = !!slack_thread_ts;
      if (conversation_type === "im" || conversation_type === "mpim") {
        if (is_mention) {
          return { title: title ?? "New mention", tags: tags("mention", isThread && "thread") };
        }
        return { title: title ?? "New direct message", tags: tags("directMessage", isThread && "thread") };
      }

      if (conversation_type === "channel" || conversation_type === "group") {
        if (is_mention) {
          return {
            title: title ?? "New mention",
            tags: tags("mention", { category: "channel", customLabel: conversation_name }),
          };
        }

        return {
          title: title ?? "New message",
          tags: tags({ category: "channel", customLabel: conversation_name }),
        };
      }

      return {
        title: title ?? "New message",
      };
    }
    case "notification_notion": {
      const pageTag = inner.page_title && ({ category: "space", customLabel: inner.page_title } as const);
      switch (inner.type) {
        case "notification_notion_commented":
          return { title, tags: tags("comment", pageTag) };
        case "notification_notion_user_invited":
          return { title: "Invitation to page", tags: tags("update", pageTag) };
        case "notification_notion_user_mentioned":
          return { title, tags: tags("mention", pageTag) };
        case "notification_notion_reminder":
          return { title: "Reminder", tags: tags("reminder", pageTag) };
        default:
          return { title: "New Notion notification" };
      }
    }
    case "notification_figma_comment": {
      return {
        title,
        tags: tags(
          inner.is_mention ? "mention" : "comment",
          inner.file_name && { category: "space", customLabel: inner.file_name }
        ),
      };
    }
    case "notification_linear": {
      const issueTag = inner.issue_title && ({ category: "space", customLabel: inner.issue_title } as const);
      if (inner.type === "Comment") {
        switch (inner.origin) {
          case "mention":
            return { title, tags: tags("mention", issueTag) };
          default:
            return { title, tags: tags("comment", issueTag) };
        }
      }
      switch (inner.origin) {
        case "assign":
          return { title: "You've been assigned", tags: tags("assigned", issueTag) };
        // return isGroupItem ? "Assigned you" : `Assigned you to "${inner.issue_title}"`;
        case "cancel":
        case "state:cancel":
          return { title: "Issue cancelled", tags: tags("update", issueTag) };
        case "state:complete":
          return { title: "Issue completed", tags: tags("update", issueTag) };
        default:
          return { title: "Issue created", tags: tags("update", issueTag) };
      }
    }
    case "notification_jira_issue": {
      const issueTag = inner.issue_title && ({ category: "space", customLabel: inner.issue_title } as const);
      switch (inner.type) {
        case "comment_created":
          return { title: title ?? "New comment", tags: tags("comment", issueTag) };
        case "user_mentioned":
          return { title: title ?? "New mention", tags: tags("mention", issueTag) };
        case "issue_status_updated":
          return { title: updateLabel("Status", inner.to), tags: tags("update", issueTag) };
        case "issue_assigned":
          return { title: "Assigned to you", tags: tags("assigned", issueTag) };
        case "issue_field_updated": {
          const field = jiraIssueFieldAlias[inner.updated_issue_field ?? ""] ?? inner.updated_issue_field;

          if (!field) {
            return { title: "Issue updated", tags: tags("update", issueTag) };
          }

          if (!!inner.from && !inner.to) {
            return { title: `Removed field "${field}"`, tags: tags("update", issueTag) };
          }

          if (!inner.from && !!inner.to) {
            return { title: `Added field "${field}" → ${inner.to}`, tags: tags("update", issueTag) };
          }

          if (!!inner.from && !!inner.to) {
            return { title: `Updated field "${field}" → ${inner.to}`, tags: tags("update", issueTag) };
          }
        }
      }

      return { title: "New Jira notificaton" };
    }
    case "notification_github": {
      const issueTag = inner.title && ({ category: "space", customLabel: inner.title } as const);
      switch (inner.type) {
        case "mention":
          return { title, tags: tags("mention", issueTag) };
        case "assign":
          return { title, tags: tags("assigned", issueTag) };
        case "review":
          return { title, tags: tags("pr", issueTag) };
      }
      return { title: "New Github notification" };
    }
    case "notification_gmail": {
      return { title };
    }
    case "notification_asana": {
      const itemTag = inner.title && ({ category: "space", customLabel: inner.title } as const);
      if (inner.type.startsWith("status:")) {
        const statusInfo = inner.type.split(":");
        if (statusInfo[1] === "mark") {
          return {
            title: `Marked as ${statusInfo[2]}`,
            tags: tags("update", itemTag),
          };
        }
        return {
          title: `Updated to "${statusInfo[0]}"`,
          tags: tags("update", itemTag),
        };
      }
      switch (inner.type) {
        case "mention":
          return { title, tags: tags("mention", itemTag) };
        case "comment":
          return { title, tags: tags("comment", itemTag) };
        case "assign":
          return { title: "Assigned you", tags: tags("assigned", itemTag) };
      }
      return {
        title: "New Asana notification",
      };
    }
    case "notification_drive": {
      const documentTag = inner.documentName && ({ category: "space", customLabel: inner.documentName } as const);
      switch (inner.type) {
        case "mention":
          return { title, tags: tags("mention", documentTag) };
        case "comment":
          return { title, tags: tags("comment", documentTag) };
        case "invitation":
          return { title, tags: tags("update", documentTag) };
      }

      return {
        title: "New Drive notification",
      };
    }
    case "notification_clickup": {
      const documentTag = inner.title && ({ category: "space", customLabel: inner.title } as const);
      if (inner.type.startsWith("due:")) {
        const statusInfo = inner.type.split(":");
        const dueDate = new Date(parseInt(statusInfo[1], 10));

        return {
          title: `Due date changed → ${niceFormatDate(dueDate)}`,
          tags: tags("update", documentTag),
        };
      }
      if (inner.type.includes(":")) {
        const [fieldName, newValue] = inner.type.split(":");
        return {
          title: `${fieldName} changed → ${newValue}`,
          tags: tags("update", documentTag),
        };
      }
      switch (inner.type) {
        case "mention":
          return { title, tags: tags("mention", documentTag) };
        case "comment":
          return { title, tags: tags("comment", documentTag) };
        case "assign":
          return { title, tags: tags("assigned", documentTag) };
        case "task":
          return { title: "Created new task", tags: tags("update", documentTag) };
      }
      return {
        title: "New ClickUp notification",
      };
    }
    case "notification_acapela":
      return { title: inner.title, tags: tags("update") };
    default:
      return { title: "New Notification" };
  }
}

export const getNotificationMeta = cachedComputed((notification: NotificationEntity): NotificationMeta => {
  const { inner } = notification;
  const client = Object.values(integrationClients).find((client) => client.notificationTypename == inner?.__typename);
  const hasMultipleWorkspaces = (client?.getAccounts().length ?? 0) > 1 || (client?.getWorkspaces?.().length ?? 0) > 1;

  const workspaceName = hasMultipleWorkspaces && inner && "workspaceName" in inner && inner.workspaceName;

  const meta = getNotificationMetaWithoutWorkspace(notification);

  if (workspaceName) {
    if (!meta.tags) meta.tags = [];
    meta.tags.push(...tags({ category: "workspace", customLabel: workspaceName }));
  }

  return meta;
});
