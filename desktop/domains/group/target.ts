import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { SupportedIntegration } from "@aca/desktop/domains/integrations";
import { getNotificationTitle } from "@aca/desktop/domains/notification/title";

export interface NotificationGroupTarget {
  id: string;
  name: string;
  integration: SupportedIntegration | "unknown";
  integrationTitle: string;
  treatAsOne?: boolean;
}

const unknownTarget: NotificationGroupTarget = {
  id: "unknown",
  name: "Unknown",
  integration: "unknown",
  integrationTitle: "Slack conversation",
};

const getNotionDiscussionId = (inner: NotificationEntity["inner"]) =>
  (inner && inner.__typename == "notification_notion" && inner.inner.__typename == "notification_notion_commented"
    ? inner.inner.discussion_id
    : null) ?? null;

export function getNotificationGroupTarget(
  notification: NotificationEntity,
  notifications: NotificationEntity[]
): NotificationGroupTarget {
  const targetNotification = notification.inner;

  if (!targetNotification) return unknownTarget;

  if (targetNotification.__typename === "notification_figma_comment") {
    const isThread = !!targetNotification.thread_comment_id;
    return {
      id: targetNotification.file_id + "#" + targetNotification.thread_comment_id,
      name: (isThread ? "Comment Thread in " : "") + targetNotification.file_name,
      integration: "figma",
      integrationTitle: "Figma file",
      treatAsOne: isThread,
    };
  }

  if (targetNotification.__typename === "notification_notion") {
    const discussionId = getNotionDiscussionId(targetNotification);
    const hasReplies = Boolean(
      discussionId &&
        notifications.some((n) => n.id !== notification.id && getNotionDiscussionId(n.inner) === discussionId)
    );
    return {
      id: targetNotification.page_id + "#" + (hasReplies ? discussionId : ""),
      name: (hasReplies ? "Comment Thread in " : "") + targetNotification.page_title,
      integration: "notion",
      integrationTitle: "Notion page",
      treatAsOne: hasReplies,
    };
  }

  if (targetNotification.__typename === "notification_slack_message") {
    const { slack_thread_ts: threadTs, slack_message_ts: ts } = targetNotification;
    const hasReplies = Boolean(
      !threadTs &&
        notifications.some(
          ({ inner }) => inner?.__typename === "notification_slack_message" && inner.slack_thread_ts === ts
        )
    );
    return {
      id: targetNotification.slack_conversation_id + "#" + (threadTs ?? (hasReplies ? ts : "")),
      name: getNotificationTitle(notification),
      integration: "slack",
      integrationTitle: "Slack conversation",
      treatAsOne: true,
    };
  }

  if (targetNotification.__typename === "notification_linear") {
    return {
      id: targetNotification.issue_id,
      name: targetNotification.issue_title,
      integration: "linear",
      integrationTitle: "Linear issue",
      treatAsOne: true,
    };
  }

  return unknownTarget;
}
