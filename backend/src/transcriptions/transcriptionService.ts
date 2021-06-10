import { db } from "~db";
import { assertGet } from "~shared/assert";
import { getSignedDownloadUrl } from "../attachments/googleStorage";
import { getSonixClient, MediaResponse } from "./sonixClient";

export async function sendForTranscription(messageId: string) {
  const messageAttachment = await db.message_attachment.findFirst({
    where: { message_id: messageId },
    include: { attachment: true },
  });

  const attachment = assertGet(messageAttachment?.attachment, "Message to be transcribed has no attachment");
  const sonix = getSonixClient();
  const attachmentUrl = await getSignedDownloadUrl(attachment.id, attachment.mime_type);
  const language = "en";

  const media = await sonix.submitNewMedia({
    messageId,
    fileUrl: attachmentUrl,
    fileName: attachment.original_name,
    language,
  });

  await db.message.update({
    where: { id: messageId },
    data: {
      transcription: {
        create: {
          sonix_media_id: media.id,
          status: media.status,
        },
      },
    },
  });
}

export async function updateMessageTranscription(media: MediaResponse) {
  const sonix = getSonixClient();
  const transcript = await sonix.getJsonTranscript({ mediaId: media.id });

  await db.message.update({
    where: { id: media.custom_data.messageId },
    data: {
      transcription: {
        update: {
          status: media.status,
          transcript: transcript.transcript,
        },
      },
    },
  });
}
