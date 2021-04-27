import { EventHandler } from "~backend/src/events/eventHandlers";
import { db } from "~db";
import { Message_Type_Enum } from "~frontend/src/gql";
import { assert } from "~shared/assert";
import { getSignedDownloadUrl } from "../attachments/googleStorage";
import { Sonix } from "../transcriptions/sonixClient";

interface HasuraMessage {
  id: string;
  type: Message_Type_Enum;
  thread_id: string;
  text: string;
  is_draft: boolean;
  created_at: string;
  user_id: string;
  transcription: string | null;
}

const MESSAGE_TYPES_TO_BE_PROCESSED = [Message_Type_Enum.Audio, Message_Type_Enum.Video];

export const handleMessageCreated: EventHandler<HasuraMessage> = {
  triggerName: "message_created",

  handleInsert: async (userId: string, message: HasuraMessage) => {
    if (!MESSAGE_TYPES_TO_BE_PROCESSED.includes(message.type)) {
      return;
    }

    const messageAttachment = await db.message_attachments.findFirst({
      where: { message_id: message.id },
      include: { attachment: true },
    });
    const attachment = messageAttachment?.attachment;

    assert(attachment, "Media message has no attachment");

    const sonix = new Sonix();
    const attachmentUrl = await getSignedDownloadUrl(attachment.id);
    const language = "en";

    const media = await sonix.submitNewMedia({
      messageId: message.id,
      fileUrl: attachmentUrl,
      fileName: attachment.original_name || attachmentUrl,
      language,
    });

    await db.message.update({
      where: { id: message.id },
      data: {
        transcription: {
          create: {
            sonix_media_id: media.id,
            status: media.status,
          },
        },
      },
    });
  },
};
