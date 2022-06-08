import { cachedComputed } from "@aca/clientdb";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { isNotNullish } from "@aca/shared/nullish";

import { countRepeats } from "./utils";

export interface NotificationGroupTarget {
  id: string;
  isOnePreviewEnough?: boolean;
}

const unknownTarget: NotificationGroupTarget = {
  id: "unknown",
};

const getNotionDiscussionId = (inner: InnerEntity) => {
  if (
    //
    inner &&
    inner.__typename == "notification_notion" &&
    inner.inner.__typename == "notification_notion_commented"
  ) {
    return inner.inner.discussion_id ?? null;
  }

  return null;
};

type InnerEntity = NotificationEntity["inner"];

const getInners = cachedComputed(function getInners(notifications: NotificationEntity[]): InnerEntity[] {
  return notifications.map((n) => n.inner).filter(isNotNullish);
});

const getNotionDiscussionCounts = cachedComputed(function getNotionDiscussionCounts(inners: InnerEntity[]) {
  const counts = countRepeats(inners, (inner) => {
    return getNotionDiscussionId(inner) ?? undefined;
  });

  return counts;
});

//

const getSlackParentThreadCounts = cachedComputed(function getSlackParentThreadCounts(inners: InnerEntity[]) {
  return countRepeats(inners, (inner) => {
    if (inner && inner.__typename === "notification_slack_message") {
      return inner.slack_thread_ts ?? null;
    }
  });
});

export function getNotificationGroupTarget(
  notification: NotificationEntity,
  otherNotifications: NotificationEntity[]
): NotificationGroupTarget {
  const targetNotification = notification.inner;

  if (!targetNotification) return unknownTarget;

  const otherInners = getInners(otherNotifications);

  if (targetNotification.__typename === "notification_figma_comment") {
    const isThread = !!targetNotification.thread_comment_id;
    return {
      id: targetNotification.file_id + "#" + targetNotification.thread_comment_id,
      isOnePreviewEnough: isThread,
    };
  }

  if (targetNotification.__typename === "notification_notion") {
    const discussionId = getNotionDiscussionId(targetNotification);

    const notionDiscussionCount = getNotionDiscussionCounts(otherInners);

    const hasReplies = discussionId && (notionDiscussionCount.get(discussionId) ?? 0) >= 2;

    return {
      id: targetNotification.page_id + "#" + (hasReplies ? discussionId : ""),
      isOnePreviewEnough: false,
    };
  }

  if (targetNotification.__typename === "notification_slack_message") {
    const { slack_thread_ts: threadTs, slack_message_ts: ts } = targetNotification;

    const slackThreadCount = getSlackParentThreadCounts(otherInners);

    const hasReplies = threadTs && !!slackThreadCount.get(threadTs);

    return {
      id: targetNotification.slack_conversation_id + "#" + (threadTs ?? (hasReplies ? ts : "")),
      isOnePreviewEnough: true,
    };
  }

  if (targetNotification.__typename === "notification_linear") {
    return {
      id: targetNotification.issue_id,
      isOnePreviewEnough: true,
    };
  }

  if (targetNotification.__typename === "notification_jira_issue") {
    return {
      id: targetNotification.issue_id,
      isOnePreviewEnough: false,
    };
  }

  if (targetNotification.__typename === "notification_github") {
    return {
      id: `${targetNotification.issue_id || targetNotification.pr_id}`,
      isOnePreviewEnough: false,
    };
  }

  if (targetNotification.__typename === "notification_gmail") {
    return {
      id: targetNotification.gmail_thread_id ?? targetNotification.id,
      isOnePreviewEnough: true,
    };
  }

  if (targetNotification.__typename === "notification_asana") {
    return {
      id: targetNotification.task_id,
      isOnePreviewEnough: true,
    };
  }

  if (targetNotification.__typename === "notification_drive") {
    return {
      id: targetNotification.google_drive_file_id,
      isOnePreviewEnough: false,
    };
  }

  if (targetNotification.__typename === "notification_clickup") {
    return {
      id: targetNotification.task_id,
      isOnePreviewEnough: false,
    };
  }

  return unknownTarget;
}
