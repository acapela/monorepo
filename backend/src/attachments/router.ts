import { Request, Response, Router } from "express";
import { verify } from "jsonwebtoken";
import { get } from "lodash";

import { db } from "~db";
import { log } from "~shared/logger";

import { AuthenticationError, BadRequestError, NotFoundError } from "../errors/errorTypes";
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
  const jwtToken = req.cookies["next-auth.session-token"];
  if (!jwtToken) {
    throw new BadRequestError("session token missing");
  }

  let session;
  try {
    session = verify(jwtToken, process.env.AUTH_JWT_TOKEN_SECRET);
  } catch (e) {
    throw new AuthenticationError();
  }

  const userId = get(session, "id");
  if (!userId) {
    throw new BadRequestError("user id missing");
  }

  const attachment = await db.attachment.findFirst({
    where: {
      id: attachmentId,
      OR: [
        {
          // user created the attachment
          user_id: userId,
        },
        {
          message: {
            topic: {
              room: {
                OR: [
                  // public: user is a team_member
                  { is_private: false, space: { team: { team_member: { some: { user_id: userId } } } } },
                  // private: user is a room_member
                  { is_private: true, room_member: { some: { user_id: userId } } },
                ],
              },
            },
          },
        },
      ],
    },
  });

  if (!attachment) {
    throw new NotFoundError("attachment not found");
  }

  const downloadUrl = await getSignedDownloadUrl(attachmentId, attachment.mime_type);
  log.info(`serving attachment ${attachmentId}`);
  res.redirect(downloadUrl);
});
