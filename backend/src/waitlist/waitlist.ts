import axios from "axios";
import { Request, Response, Router } from "express";

import { db } from "~db";
import { assertDefined } from "~shared/assert";
import logger from "~shared/logger";

const mailchimpApiKey = assertDefined(process.env.MAILCHIMP_API_KEY, "MAILCHIMP_API_KEY is required");

export const router = Router();

interface SignupPayload {
  email?: string;
  name?: string;
}

/**
 * This endpoint handles user signup calls from the landing page
 */
router.post("/v1/waitlist", async (req: Request, res: Response) => {
  const { email, name } = req.body as SignupPayload;

  if (!email || !name) {
    logger.info("Waitlist endpoint called with missing parameters");
    return res.status(400).end();
  }
  logger.info(`Handling waitlist signup for ${email}`);

  try {
    await db.whitelist.create({ data: { email } });
    res.status(201).end();
    await axios.post(
      "https://us17.api.mailchimp.com/3.0/lists/b989557221/members/",
      JSON.stringify({
        email_address: email.toLowerCase().trim(),
        status: "subscribed",
        merge_fields: { FNAME: name },
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`user:${mailchimpApiKey}`).toString("base64")}`,
        },
      }
    );
    logger.info(`Mailchimp create subscriber API call successful`);
  } catch (e) {
    logger.error("Adding a new subscriber failed");
    return res.status(409).end();
  }
});
