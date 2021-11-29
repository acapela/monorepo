import { tryUpdateTaskSlackMessages } from "~backend/src/slack/live-messages/LiveTaskMessage";
import { tryUpdateTopicSlackMessage } from "~backend/src/slack/live-messages/LiveTopicMessage";
import { Message, MessageReaction, db } from "~db";
import { Message_Type_Enum } from "~gql";
import { convertMessageContentToPlainText } from "~richEditor/content/plainText";
import { RichEditorNode } from "~richEditor/content/types";
import { assert } from "~shared/assert";
import { trackBackendUserEvent } from "~shared/backendAnalytics";
import { getMentionNodesFromContent } from "~shared/editor/mentions";
import { logger } from "~shared/logger";
import { isEqualForPick } from "~shared/object";

import { HasuraEvent } from "../hasura";

async function prepareMessagePlainTextData(message: Message) {
  if ((message.type as Message_Type_Enum) !== "TEXT") {
    return;
  }

  if (!message.content) return;

  try {
    const plainText = convertMessageContentToPlainText(message.content as RichEditorNode);

    await db.message.update({ where: { id: message.id }, data: { content_text: plainText } });
  } catch (error) {
    logger.warn("Failed to prepare message plain text content", message);
  }
}

async function addTopicMembers(message: Message) {
  const userIds = new Set(
    getMentionNodesFromContent(message.content as never).map((mentionNode) => mentionNode.attrs.data.userId)
  );
  await db.topic_member.createMany({
    data: Array.from(userIds).map((userId) => ({ topic_id: message.topic_id, user_id: userId })),
    skipDuplicates: true,
  });
}

async function maybeUpdateSlackMessage(message: Message) {
  const olderMessagesCount = await db.message.count({
    where: { topic_id: message.topic_id, created_at: { lt: message.created_at } },
  });
  const isFirstMessage = olderMessagesCount == 0;
  if (!isFirstMessage) {
    return;
  }
  const topic = await db.topic.findFirst({ where: { id: message.topic_id } });
  assert(topic, "must have topic");
  await tryUpdateTopicSlackMessage(topic);
}

export async function handleMessageChanges(event: HasuraEvent<Message>) {
  const userId = event.userId || event.item?.user_id || event.itemBefore?.user_id;
  assert(userId, "cannot find user_id for message");
  if (event.type === "create") {
    // this is required for fetching the attachments
    const message = await db.message.findUnique({
      where: { id: event.item.id },
      include: { attachment: true },
    });
    assert(message, "message must exist");
    trackBackendUserEvent(userId, "Sent Message", {
      messageType: event.item.type as Message_Type_Enum,
      hasAttachments: message.attachment.length !== 0,
      isReply: !!event.item.replied_to_message_id,
    });
  } else if (event.type === "delete") {
    trackBackendUserEvent(userId, "Deleted Message", {
      messageId: event.item?.id,
    });
    return;
  } else if (event.type === "update") {
    trackBackendUserEvent(userId, "Edited Message", {
      messageId: event.item?.id,
    });
    if (!isEqualForPick(event.item, event.itemBefore, ["content"])) {
      await tryUpdateTaskSlackMessages({
        taskSlackMessage: { task: { message_id: event.item.id } },
        message: { id: event.item.id },
      });
    }
  }

  const message = event.item;
  await Promise.all([prepareMessagePlainTextData(message), addTopicMembers(message), maybeUpdateSlackMessage(message)]);
}

export async function handleMessageReactionChanges(event: HasuraEvent<MessageReaction>) {
  if (event.type === "create") {
    const userId = event.userId || event.item.user_id;
    assert(userId, "cannot find user_id for message reaction");
    trackBackendUserEvent(userId, "Reacted To Message", {
      messageId: event.item.message_id,
      reactionEmoji: event.item.emoji,
    });
  }
}
