import { db, Message } from "~db";
import { Message_Type_Enum } from "~gql";
import { sendForTranscription } from "../transcriptions/transcriptionService";
import { convertMessageContentToPlainText } from "~richEditor/content/plainText";
import { RichEditorContent } from "~richEditor/content/types";
import log from "~shared/logger";

const MESSAGE_TYPES_TO_BE_PROCESSED: Message_Type_Enum[] = ["AUDIO", "VIDEO"];

export async function handleMessageCreated(message: Message) {
  if (!MESSAGE_TYPES_TO_BE_PROCESSED.includes(message.type as Message_Type_Enum)) {
    return;
  }

  await sendForTranscription(message.id);
}

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
