import { db, Message, Notification, PrismaPromise } from "~db";
import { Message_Type_Enum } from "~gql";
import log from "~shared/logger";
import { convertMessageContentToPlainText } from "~richEditor/content/plainText";
import { RichEditorNode } from "~richEditor/content/types";
import { getNodesFromContentByType } from "~richEditor/content/helper";
import { EditorMentionData } from "~shared/types/editor";
import { uniqBy } from "lodash";
import { HasuraEvent } from "../hasura";
import { createNotification } from "../notifications/entity";

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

async function createMessageMentionNotifications(message: Message, messageBefore: Message | null) {
  const mentionNodes = getNewMentionNodesFromMessage(message, messageBefore);

  if (mentionNodes.length === 0) {
    // no mentions in message
    return;
  }

  const createNotificationPromises: Array<PrismaPromise<Notification>> = [];

  /**
   * Avoid situation where multiple mentions of same user in the same message would result in multiple notifications
   * being created.
   */
  const userUniqueMentionNodes = uniqBy(mentionNodes, (mention) => mention.attrs.data.userId);

  for (const mentionNode of userUniqueMentionNodes) {
    const mentionedUserId = mentionNode.attrs.data.userId;

    const isUserMentioningSelf = mentionedUserId === message.user_id;

    // Don't create notification if user is mentioning self in the message.
    if (isUserMentioningSelf) {
      continue;
    }

    const createNotificationPromise = createNotification({
      type: "topicMention",
      payload: { topicId: message.topic_id, mentionedByUserId: message.user_id },
      userId: mentionNode.attrs.data.userId,
    });

    createNotificationPromises.push(createNotificationPromise);
  }

  return await db.$transaction(createNotificationPromises);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function handleMessageChanges(event: HasuraEvent<Message>) {
  if (event.type === "delete") return;

  await Promise.all([
    prepareMessagePlainTextData(event.item),
    // In case message includes @mentions, create notifications for them
    createMessageMentionNotifications(event.item, event.itemBefore),
  ]);
}
