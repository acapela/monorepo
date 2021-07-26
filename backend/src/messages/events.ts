import { db, Message, Notification } from "~db";
import { Message_Type_Enum } from "~gql";
import log from "~shared/logger";
import { convertMessageContentToPlainText } from "~richEditor/content/plainText";
import { RichEditorNode } from "~richEditor/content/types";
import { getNodesFromContentByType } from "~richEditor/content/helper";
import { EditorMentionData } from "~shared/types/editor";
import { createNotificationData } from "~shared/notifications/types";

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

  return mentionNodes;
}

function createMessageMentionNotifications(message: Message) {
  const mentionNodes = getMentionNodesFromMessage(message);

  if (mentionNodes.length === 0) {
    // no mentions in message
    return;
  }

  const createNotificationPromises: Array<Promise<Notification>> = [];

  for (const mentionNode of mentionNodes) {
    const mentionedUserId = mentionNode.attrs.data.userId;
    const notificationData = createNotificationData("topicMention", {
      topicId: message.topic_id,
      mentionedByUserId: message.user_id,
    });

    const isUserMentioningSelf = mentionedUserId === message.user_id;

    // Don't create notification if user is mentioning self in the message.
    if (isUserMentioningSelf) {
      // continue;
    }

    const createNotificationPromise = db.notification.create({
      data: { data: notificationData, user_id: mentionNode.attrs.data.userId },
    });

    createNotificationPromises.push(createNotificationPromise);
  }

  return Promise.all(createNotificationPromises);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function handleMessageCreated(message: Message, _userId: string | null) {
  await Promise.all([
    // In case message includes @mentions, create notifications for them
    createMessageMentionNotifications(message),
  ]);
}
