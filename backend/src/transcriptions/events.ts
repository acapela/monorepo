import { Transcription, db } from "~db";

import { HasuraEvent } from "../hasura";

async function updateMessageUpdatedAtByTranscription(transcription: Transcription) {
  await db.message.updateMany({
    where: { attachment: { some: { transcription_id: transcription.id } } },
    data: {
      updated_at: new Date(),
    },
  });
}

export async function handleTranscriptionUpdates({ item: transcription, type }: HasuraEvent<Transcription>) {
  if (type !== "delete") {
    await updateMessageUpdatedAtByTranscription(transcription);
  }
}
