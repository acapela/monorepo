import { Request, Response, Router } from "express";
import { Transcription_Status_Enum } from "~frontend/src/gql";
import logger from "~shared/logger";
import { BadRequestError } from "../errors";
import { MediaResponse } from "./sonixClient";
import { updateMessageTranscription } from "./transcriptionService";

export const router = Router();

/**
 * This endpoint handles webhooks from Sonix once transcription completes or fails
 */
router.post("/v1/transcriptions", async (req: Request, res: Response) => {
  const { secret } = req.query;

  if (secret !== process.env.SONIX_CALLBACK_SECRET) {
    logger.info("Invalid Sonix callback secret");

    return res.status(401).end();
  }

  const media = req.body as MediaResponse;

  if (!media) {
    throw new BadRequestError("Sonix call has no body");
  }

  if (media.status === Transcription_Status_Enum.Completed) {
    await updateMessageTranscription(media);
  }

  res.status(204).end();
});
