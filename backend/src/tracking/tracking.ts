import cors from "cors";
import { Request, Response, Router } from "express";

import { trackBackendUserEvent } from "~shared/backendAnalytics";
import { log } from "~shared/logger";

import { HttpStatus } from "../http";

export const router = Router();

interface TrackingPayload {
  userId: string;
}

/**
 * We're calling those endpoints from landing which is a different url, this we need to enable CORS for this endpoints
 * server side
 */
router.use(
  cors({
    origin: [`https://acape.la`, `https://acapela.com`],
  })
);

/**
 * This endpoint handles user signup calls from the landing page
 */
router.post("/v1/setup", async (req: Request, res: Response) => {
  const { userId } = req.body as TrackingPayload;

  if (!userId) {
    log.info("Tracking endpoint called with missing parameters");
    return res.status(HttpStatus.BAD_REQUEST).end();
  }

  try {
    trackBackendUserEvent(userId, "Opened App");
    res.status(HttpStatus.OK).end();
  } catch (e) {
    console.error(e);
    log.error(`Tracking a frontend event ${event} failed`);
    return res.status(HttpStatus.CONFLICT).end();
  }
});
