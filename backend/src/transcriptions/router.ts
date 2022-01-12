import { Request, Response, Router } from "express";

import { logger } from "@aca/shared/logger";

import { BadRequestError } from "../errors/errorTypes";
import { HttpStatus } from "../http";
import { SonixMediaResponse } from "./sonixClient";
import { handleAttachementTranscriptionStatusUpdate } from "./transcriptionService";

export const router = Router();

/**
 * This endpoint handles webhooks from Sonix once transcription completes or fails
 */
router.post("/v1/transcriptions", async (req: Request, res: Response) => {
  const { secret } = req.query;

  if (secret !== process.env.SONIX_CALLBACK_SECRET) {
    logger.info("Invalid Sonix callback secret");

    return res.status(HttpStatus.UNAUTHORIZED).end();
  }

  const media = req.body as SonixMediaResponse;

  if (!media) {
    throw new BadRequestError("Sonix call has no body");
  }

  logger.info(`Received update from sonix - current status is ${media.status}`);

  if (media.status === "completed") {
    await handleAttachementTranscriptionStatusUpdate(media);
  }

  res.status(HttpStatus.NO_CONTENT).end();
});
