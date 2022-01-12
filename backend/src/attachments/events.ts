import { initializeAttachmentTranscription } from "@aca/backend/src/transcriptions/transcriptionService";
import { Attachment, db } from "@aca/db";
import { Message_Type_Enum } from "@aca/gql";
import { logger } from "@aca/shared/logger";

import { HasuraEvent } from "../hasura";

const MESSAGE_TYPES_TO_BE_PROCESSED: Message_Type_Enum[] = ["AUDIO", "VIDEO"];

export async function handleAttachmentUpdates({ item: attachment }: HasuraEvent<Attachment>) {
  const messageId = attachment.message_id;
  if (!messageId) return;

  const message = await db.message.findUnique({ where: { id: messageId } });
  if (!message) return;

  if (MESSAGE_TYPES_TO_BE_PROCESSED.includes(message.type as Message_Type_Enum)) {
    logger.info("Sending message for transcription");
    try {
      await initializeAttachmentTranscription(attachment);
    } catch (error) {
      logger.error(`Failed to prepare `, { error });
    }
  }
}
