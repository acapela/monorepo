import { Request, Response, Router } from "express";

import { getUserIdFromRequest } from "@aca/backend/src/utils";
import { db } from "@aca/db";
import { logger } from "@aca/shared/logger";

import { BadRequestError, NotFoundError } from "../errors/errorTypes";
import { getSignedDownloadUrl } from "./googleStorage";

export const router = Router();

/**
 * This endpoint handles attachments
 */
router.get("/attachments/:id", async (req: Request, res: Response) => {
  const attachmentId = req.params.id;
  if (!attachmentId) {
    throw new BadRequestError("attachment id missing");
  }

  const userId = getUserIdFromRequest(req);

  const attachment = await db.attachment.findFirst({
    where: {
      id: attachmentId,
      OR: [
        {
          // user created the attachment
          user_id: userId,
        },
        { message: { topic: { team: { team_member: { some: { user_id: userId } } } } } },
      ],
    },
  });

  if (!attachment) {
    throw new NotFoundError("attachment not found");
  }

  const downloadUrl = await getSignedDownloadUrl(attachmentId, attachment.mime_type);
  logger.info(`serving attachment ${attachmentId}`);
  res.redirect(downloadUrl);
});
