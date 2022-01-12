import { Attachment, Prisma, db } from "@aca/db";
import { assert } from "@aca/shared/assert";

import { getSignedDownloadUrl } from "../attachments/googleStorage";
import { SonixCustomData } from "./customData";
import { SonixMediaResponse, fetchSonixTranscriptForMedia, requestSonixMediaTranscript } from "./sonixClient";

export async function initializeAttachmentTranscription(attachment: Attachment) {
  const attachmentUrl = await getSignedDownloadUrl(attachment.id, attachment.mime_type);
  const language = "en";

  const transcriptionRequestInfo = await requestSonixMediaTranscript({
    attachmentId: attachment.id,
    fileUrl: attachmentUrl,
    fileName: attachment.original_name,
    language,
  });

  await db.attachment.update({
    where: { id: attachment.id },
    data: {
      transcription: {
        create: {
          sonix_media_id: transcriptionRequestInfo.id,
          status: transcriptionRequestInfo.status,
        },
      },
    },
  });
}

export async function handleAttachementTranscriptionStatusUpdate(mediaResponse: SonixMediaResponse) {
  const { attachmentId }: SonixCustomData = mediaResponse.custom_data;

  const transcriptInfo = await fetchSonixTranscriptForMedia(mediaResponse.id);

  const attachment = await db.attachment.findUnique({ where: { id: attachmentId } });

  assert(attachment, `No attachment for given id ${attachmentId}`);
  assert(attachment.transcription_id, `Provided attachment ${attachmentId} has no transcript`);

  await db.transcription.update({
    where: { id: attachment.transcription_id },
    data: {
      status: mediaResponse.status,
      transcript: transcriptInfo.transcript as unknown as Prisma.InputJsonValue,
    },
  });
}
