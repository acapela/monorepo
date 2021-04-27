import { Request, Response, Router } from "express";
import { db } from "~db";
import { Transcription_Status_Enum } from "~frontend/src/gql";
import { assert } from "~shared/assert";
import logger from "~shared/logger";
import { MediaResponse, Sonix } from "./sonixClient";

export const router = Router();

router.post("/v1/transcriptions", async (req: Request, res: Response) => {
  const { secret } = req.query;

  if (secret !== process.env.SONIX_CALLBACK_SECRET) {
    logger.info("Invalid Sonix callback secret");

    return res.status(401).end();
  }

  const media = req.body as MediaResponse;

  assert(media, "Sonix call has no body");

  if (media.status === Transcription_Status_Enum.Completed) {
    const sonix = new Sonix();
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

  res.status(204).end();
});
