import { Attachment, db } from "~db";
import { Message_Type_Enum } from "~gql";
import { sendForTranscription } from "~backend/src/transcriptions/transcriptionService";

const MESSAGE_TYPES_TO_BE_PROCESSED: Message_Type_Enum[] = ["AUDIO", "VIDEO"];

export async function handleAttachmentUpdates(attachment: Attachment) {
  const messageId = attachment.message_id;
  if (!messageId) return;

  const message = await db.message.findUnique({ where: { id: messageId } });
  if (!message) return;

  if (MESSAGE_TYPES_TO_BE_PROCESSED.includes(message.type as Message_Type_Enum)) {
    await sendForTranscription(attachment);
  }
}
