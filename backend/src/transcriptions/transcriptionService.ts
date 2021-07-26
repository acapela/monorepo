import { Attachment, db } from "~db";
import { getSignedDownloadUrl } from "../attachments/googleStorage";
import { getSonixClient, MediaResponse } from "./sonixClient";
import { assertDefined } from "~shared/assert";

export async function sendForTranscription(attachment: Attachment) {
  const messageId = assertDefined(attachment?.message_id, "Attachment to be transcribed does not have message_id");

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
