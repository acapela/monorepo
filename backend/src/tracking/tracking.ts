import { Request, Response, Router } from "express";

import { BadRequestError } from "~backend/src/errors/errorTypes";
import { getUserIdFromRequest } from "~backend/src/utils";
import { trackBackendUserEvent } from "~shared/backendAnalytics";
import { log } from "~shared/logger";
import { AnalyticsEventName } from "~shared/types/analytics";

import { HttpStatus } from "../http";

export const router = Router();

/**
 * This endpoint handles user signup calls from the landing page
 */
router.post("/v1/track", async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);

  const eventName = req.body.eventName as AnalyticsEventName;
  if (!eventName) {
    throw new BadRequestError("event name missing");
  }

  try {
    trackBackendUserEvent(userId, eventName, req.body.payload);
    res.status(HttpStatus.OK).end();
  } catch (e) {
    console.error(e);
    log.error(`Tracking a frontend event ${eventName} failed`);
    return res.status(HttpStatus.CONFLICT).end();
  }
});
