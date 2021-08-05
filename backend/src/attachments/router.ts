import { get, map } from "lodash";
import { Request, Response, Router } from "express";
import { verify } from "jsonwebtoken";
import logger from "~shared/logger";
import { AuthenticationError, BadRequestError } from "../errors/errorTypes";
import { db } from "~db";
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

  const session = verify(jwtToken, process.env.AUTH_JWT_TOKEN_SECRET);
  const userId = get(session, "id");
  if (!userId) {
    throw new BadRequestError("user id missing");
  }

  const attachment = await db.attachment.findUnique({
    where: {
      id: attachmentId,
    },
    include: {
      message: {
        include: {
          topic: {
            include: {
              room: {
                include: {
                  space: {
                    include: {
                      team: {
                        include: {
                          team_member: true,
                        },
                      },
                      space_member: true,
                    },
                  },
                  room_member: true,
                },
              },
              topic_member: true,
            },
          },
        },
      },
    },
  });

  if (!attachment) {
    throw new BadRequestError("attachment not found");
  }

  const message = attachment.message;
  let accessAllowed = false;
  if (!message) {
    if (attachment.user_id !== userId) {
      throw new BadRequestError("attachment not found");
    }
    accessAllowed = true;
  }

  if (message && message.topic.room.is_private) {
    // if the room is private check topic_member, room_member, space_member
    accessAllowed =
      map(message.topic.topic_member, "user_id").includes(userId) ||
      map(message.topic.room.room_member, "user_id").includes(userId) ||
      map(message.topic.room.space.space_member, "user_id").includes(userId);
  }
  if (message && !message.topic.room.is_private) {
    // if the room is not private check topic_member or team_member
    accessAllowed =
      map(message.topic.topic_member, "user_id").includes(userId) ||
      map(message.topic.room.space.team.team_member, "user_id").includes(userId);
  }

  if (!accessAllowed) {
    throw new AuthenticationError("you are not allowed to view this attachment");
  }

  const downloadUrl = await getSignedDownloadUrl(attachmentId, attachment.mime_type);
  logger.info(`serving attachment ${attachmentId}`);
  res.redirect(downloadUrl);
});
