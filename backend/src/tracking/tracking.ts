import { Request, Response, Router } from "express";

import { BadRequestError } from "@aca/backend/src/errors/errorTypes";
import { getUserIdFromRequest } from "@aca/backend/src/utils";
import { UserFragment } from "@aca/gql";
import { trackBackendUserEvent, trackFirstBackendUserEvent } from "@aca/shared/backendAnalytics";
import { logger } from "@aca/shared/logger";
import { AnalyticsEventName } from "@aca/shared/types/analytics";

import { HttpStatus } from "../http";

export const router = Router();

/**
 * This endpoint acts as a proxy for frontend tracking calls to avoid ad blockers
 */

router.post("/v1/track", async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);

  const eventName = req.body.eventName as AnalyticsEventName;
  if (!eventName) {
    throw new BadRequestError("event name missing");
  }

  try {
    const user = req.body.user as UserFragment | undefined;
    if (user) {
      trackFirstBackendUserEvent(user, eventName, req.body.payload);
    } else {
      trackBackendUserEvent(userId, eventName, req.body.payload);
    }
    res.status(HttpStatus.OK).end();
  } catch (error) {
    logger.error(error, `Tracking a frontend event ${eventName} failed`);
    return res.status(HttpStatus.CONFLICT).end();
  }
});
