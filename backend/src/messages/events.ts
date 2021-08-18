import { uniq, uniqBy } from "lodash";

import { Message, Notification, PrismaPromise, Task, db } from "~db";
import { Message_Type_Enum } from "~gql";
import { getNodesFromContentByType } from "~richEditor/content/helper";
import { convertMessageContentToPlainText } from "~richEditor/content/plainText";
import { RichEditorNode } from "~richEditor/content/types";
import { assert } from "~shared/assert";
import log from "~shared/logger";
import { EditorMentionData } from "~shared/types/editor";

import { HasuraEvent } from "../hasura";
import { createNotification } from "../notifications/entity";
import { updateRoomLastActivityDate } from "../rooms/rooms";

export async function prepareMessagePlainTextData(message: Message) {
  if ((message.type as Message_Type_Enum) !== "TEXT") {
    return;
  }

  if (!message.content) return;

  try {
    const plainText = convertMessageContentToPlainText(message.content as RichEditorNode);

    await db.message.update({ where: { id: message.id }, data: { content_text: plainText } });
  } catch (error) {
    log.warn("Failed to prepare message plain text content", message);
  }
}

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

async function createMessageMentionNotifications(message: Message, messageBefore: Message | null) {
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

async function createMessageMentionTasks(message: Message, messageBefore: Message | null) {
  const mentionedUserIds = getMentionedUserIdsFromMessage(message, messageBefore);
  const createTasksPromises: Array<PrismaPromise<Task>> = [];

  for (const mentionedUserId of mentionedUserIds) {
    createTasksPromises.push(
      db.task.create({
        data: { message_id: message.id, user_id: mentionedUserId },
      })
    );
  }

  return await db.$transaction(createTasksPromises);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function handleMessageChanges(event: HasuraEvent<Message>) {
  if (event.type === "delete") return;

  const topicInfo = await db.topic.findFirst({ where: { id: event.item.topic_id } });

  assert(topicInfo, "Message has no topic attached");

  await Promise.all([
    updateRoomLastActivityDate(topicInfo.room_id),
    prepareMessagePlainTextData(event.item),
    // In case message includes @mentions, create notifications for them
    createMessageMentionNotifications(event.item, event.itemBefore),
    createMessageMentionTasks(event.item, event.itemBefore),
  ]);
}
