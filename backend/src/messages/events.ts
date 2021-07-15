import { get } from "lodash";
import { db, Message } from "~db";
import { Message_Type_Enum } from "~gql";
import log from "~shared/logger";
import { convertMessageContentToPlainText } from "~richEditor/content/plainText";
import { RichEditorContent } from "~richEditor/content/types";
import { getNodesFromContentByType } from "~richEditor/content/helper";
import { MentionNotification } from "~backend/src/messages/MentionNotification";
import { sendNotification } from "~backend/src/notifications/sendNotification";
import { findUserById, getNormalizedUserName } from "~backend/src/users/users";
import { UnprocessableEntityError } from "~backend/src/errors/errorTypes";

export async function prepareMessagePlainTextData(message: Message) {
  if ((message.type as Message_Type_Enum) !== "TEXT") {
    return;
  }

  if (!message.content) return;

  try {
    const plainText = convertMessageContentToPlainText(message.content as RichEditorContent);

    await db.message.update({ where: { id: message.id }, data: { content_text: plainText } });
  } catch (error) {
    log.warn("Failed to prepare message plain text content", message);
  }
}

export async function handleMentionCreated(message: Message, userId: string | null) {
  const content = message.content as RichEditorContent;
  const mentions = getNodesFromContentByType(content, "mention");
  if (mentions.length === 0) {
    // no mentions in message
    return;
  }

  const [topic, messageAuthor] = await Promise.all([
    db.topic.findUnique({
      where: { id: message.topic_id },
      include: {
        room: true,
      },
    }),
    findUserById(message.user_id),
  ]);

  if (!topic) {
    throw new UnprocessableEntityError(`topic ${message.topic_id} does not exist`);
  }
  if (!messageAuthor) {
    throw new UnprocessableEntityError(`user ${message.user_id} does not exist`);
  }

  const defaultMentionNotificationParams = {
    authorName: getNormalizedUserName(messageAuthor),
    topicName: topic.name || "a topic",
    spaceId: topic.room.space_id,
    roomId: topic.room.id,
    topicId: topic.id,
  };

  const notificationSent = new Set();
  for (const mention of mentions) {
    const mentionedUserId = get(mention, "attrs.data.userId");
    // skip if self-tag or notification already sent
    if (!mentionedUserId || mentionedUserId === userId || notificationSent.has(mentionedUserId)) continue;

    const mentionedUser = await findUserById(mentionedUserId);
    if (!mentionedUser || !mentionedUser.email) {
      log.warn("user not found", { mentionedUserId });
      continue;
    }
    const notification = new MentionNotification({
      recipientEmail: mentionedUser.email,
      recipientName: getNormalizedUserName(mentionedUser),
      ...defaultMentionNotificationParams,
    });
    notificationSent.add(mentionedUserId);

    await sendNotification(notification);

    log.info("Sent mention notification", {
      message_id: message.id,
      mentionedUserId,
    });
  }
}
