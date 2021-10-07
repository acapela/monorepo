import { Message, MessageReaction, db } from "~db";
import { Message_Type_Enum } from "~gql";
import { convertMessageContentToPlainText } from "~richEditor/content/plainText";
import { RichEditorNode } from "~richEditor/content/types";
import { assert } from "~shared/assert";
import { log } from "~shared/logger";

import { HasuraEvent } from "../hasura";

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

export async function handleMessageChanges(event: HasuraEvent<Message>) {
  await db.topic.update({ where: { id: event.item.topic_id }, data: { updated_at: new Date() } });

  if (event.type === "delete") return;

  const topicInfo = await db.topic.findFirst({ where: { id: event.item.topic_id } });

  assert(topicInfo, "Message has no topic attached");

  await Promise.all([prepareMessagePlainTextData(event.item)]);
}

export async function handleMessageReactionChanges(event: HasuraEvent<MessageReaction>) {
  await db.message.update({ where: { id: event.item.message_id }, data: { updated_at: new Date() } });
}
