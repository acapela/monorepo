import { uniq, uniqBy } from "lodash";

import { Message, PrismaPromise, Task, db } from "~db";
import { RichEditorNode } from "~richEditor/content/types";
import { trackBackendUserEvent } from "~shared/backendAnalytics";
import { getMentionNodesFromContent } from "~shared/editor/mentions";
import { EditorMentionData } from "~shared/types/editor";
import { MentionType } from "~shared/types/mention";

const toUniqueMentionIdentifier = ({ userId, type }: EditorMentionData) => `${userId}-${type}`;

function getMentionNodesFromMessage(message: Message) {
  const content = message.content as RichEditorNode;
  const mentionNodes = getMentionNodesFromContent(content);

  return uniqBy(mentionNodes, (mention) => toUniqueMentionIdentifier(mention.attrs.data));
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

  await Promise.all(
    mentionedUserIds.map((mentionedUserId) => {
      trackBackendUserEvent(message.user_id, "Created Mention", {
        mentionedUserId,
        isToSelf: mentionedUserId === message.user_id,
        messageId: message.id,
      });

      return Promise.resolve();
    })
  );
}

function getHighestPriorityTaskType(types: MentionType[]): MentionType {
  if (types.includes("request-response")) return "request-response";
  return "request-read";
}

export async function createTasksFromNewMentions(message: Message, messageBefore: Message | null) {
  const allMentionsInMessage = getNewMentionNodesFromMessage(message, messageBefore);

  const possibleNewTasksPerUserInMessage: Record<string, Array<MentionType>> = {};

  for (const mention of allMentionsInMessage) {
    const { userId: mentionedUserId, type } = mention.attrs.data;

    if (possibleNewTasksPerUserInMessage[mentionedUserId]) {
      possibleNewTasksPerUserInMessage[mentionedUserId].push(type);
    } else {
      possibleNewTasksPerUserInMessage[mentionedUserId] = [type];
    }
  }

  const mostImportantSingleTaskPerUserInMessage: Array<{ user_id: string; type: MentionType }> = Object.keys(
    possibleNewTasksPerUserInMessage
  ).map((user_id) => ({
    user_id,
    type: getHighestPriorityTaskType(possibleNewTasksPerUserInMessage[user_id]),
  }));

  const createTasksPromises: Array<PrismaPromise<Task>> = [];

  for (const { user_id, type } of mostImportantSingleTaskPerUserInMessage) {
    // We're not checking for user permission to the topic, as it is possible that task creation actually gives the user
    // access to the topic.

    createTasksPromises.push(
      db.task.create({
        data: { message_id: message.id, user_id, type },
      })
    );
  }

  const createdTasks = (await db.$transaction(createTasksPromises)) as Task[];

  for (const task of createdTasks) {
    trackBackendUserEvent(message.user_id, "Created Task", {
      taskType: task.type as string,
      mentionedUserId: task.user_id,
      taskId: task.id,
      messageId: task.message_id,
    });
  }

  return createdTasks;
}
