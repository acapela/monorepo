import cors from "cors";
import { Request, Response, Router } from "express";

import { db } from "~db";
import logger from "~shared/logger";

import { HttpStatus } from "../http";
import { addUserToMailchimp } from "./mailchimp";

export const router = Router();

interface SignupPayload {
  email?: string;
  firstName?: string;
}

/**
 * We're calling those endpoints from landing which is a different url, this we need to enable CORS for this endpoints
 * server side
 */
router.use(
  cors({
    origin: [
      `https://acape.la`,
      `https://acapela.com`,
      // Those are for testing purposes.
      `http://localhost`,
      `https://landing-page-git-v3-acapela.vercel.app/`,
    ],
  })
);

/**
 * This endpoint handles user signup calls from the landing page
 */
router.post("/v1/waitlist", async (req: Request, res: Response) => {
  const { email, firstName } = req.body as SignupPayload;

  if (!email) {
    logger.info("Waitlist endpoint called with missing parameters");
    return res.status(HttpStatus.BAD_REQUEST).end();
  }
  logger.info(`Handling waitlist signup for ${email}`);

  try {
    await db.whitelist.create({ data: { email } });
    // we want to respond with success even when the mailchimp API call fails
    res.status(HttpStatus.CREATED).end();
    await addUserToMailchimp(email, firstName);
    logger.info(`User waitlist signup successful`);
  } catch (e) {
    console.error(e);
    logger.error("Adding a new subscriber failed");
    return res.status(HttpStatus.CONFLICT).end();
  }
});
