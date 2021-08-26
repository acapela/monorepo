import { uniq, uniqBy } from "lodash";

import { Message, Notification, PrismaPromise, Task, db } from "~db";
import { getNodesFromContentByType } from "~richEditor/content/helper";
import { RichEditorNode } from "~richEditor/content/types";
import { EditorMentionData } from "~shared/types/editor";
import { TaskType } from "~shared/types/task";

import { createNotification } from "../notifications/entity";

function getMentionNodesFromMessage(message: Message) {
  const content = message.content as RichEditorNode;
  const mentionNodes = getNodesFromContentByType<{ data: EditorMentionData }>(content, "mention");

  return uniqBy(mentionNodes, (mention) => mention.attrs.data.userId);
}

function getNewMentionNodesFromMessage(message: Message, messageBefore: Message | null) {
  const mentionNodesNow = getMentionNodesFromMessage(message);

  if (!messageBefore) {
    return mentionNodesNow;
  }

  const mentionNodesBefore = getMentionNodesFromMessage(messageBefore);

  const mentionedUserIdsBefore = new Set(mentionNodesBefore.map((n) => n.attrs.data.userId));
  const newMentionNodes = mentionNodesNow.filter(
    (mentionNodeNow) => !mentionedUserIdsBefore.has(mentionNodeNow.attrs.data.userId)
  );

  return newMentionNodes;
}

function getMentionedUserIdsFromMessage(message: Message, messageBefore: Message | null): string[] {
  const mentionNodes = getNewMentionNodesFromMessage(message, messageBefore);

  if (mentionNodes.length === 0) {
    // no mentions in message
    return [];
  }

  /**
   * Avoid situation where multiple mentions of same user in the same message
   */
  const allUserIds = mentionNodes.map((mention) => mention.attrs.data.userId);
  const uniqueUserIds = uniq(allUserIds);

  const userIdsExcludingMessageAuthor = uniqueUserIds.filter((userId) => userId != message.user_id);

  return userIdsExcludingMessageAuthor;
}

export async function createMessageMentionNotifications(message: Message, messageBefore: Message | null) {
  const mentionedUserIds = getMentionedUserIdsFromMessage(message, messageBefore);

  const createNotificationPromises: Array<PrismaPromise<Notification>> = [];

  for (const mentionedUserId of mentionedUserIds) {
    const createNotificationPromise = createNotification({
      type: "topicMention",
      payload: { topicId: message.topic_id, mentionedByUserId: message.user_id },
      userId: mentionedUserId,
    });

    createNotificationPromises.push(createNotificationPromise);
  }

  return await db.$transaction(createNotificationPromises);
}

function getHighestPriorityTaskType(types: TaskType[]): TaskType {
  if (types.includes("request-response")) return "request-response";
  return "request-read";
}

export async function createTasksFromNewMentions(message: Message, messageBefore: Message | null) {
  const allMentionsInMessage = getNewMentionNodesFromMessage(message, messageBefore);

  const possibleNewTasksPerUserInMessage: Record<string, Array<TaskType>> = {};

  allMentionsInMessage.map((mention) => {
    const { userId, type } = mention.attrs.data;

    // Exclude directly mention types that don't generate a task
    if (type === "notification-only") {
      return;
    }

    if (possibleNewTasksPerUserInMessage[userId]) {
      possibleNewTasksPerUserInMessage[userId].push(type);
    } else {
      possibleNewTasksPerUserInMessage[userId] = [type];
    }
  });

  const mostImportantSingleTaskPerUserInMessage: Array<{ user_id: string; type: TaskType }> = Object.keys(
    possibleNewTasksPerUserInMessage
  ).map((user_id) => ({
    user_id,
    type: getHighestPriorityTaskType(possibleNewTasksPerUserInMessage[user_id]),
  }));

  const createTasksPromises: Array<PrismaPromise<Task>> = [];

  for (const { user_id, type } of mostImportantSingleTaskPerUserInMessage) {
    createTasksPromises.push(
      db.task.create({
        data: { message_id: message.id, user_id, type },
      })
    );
  }

  return await db.$transaction(createTasksPromises);
}
