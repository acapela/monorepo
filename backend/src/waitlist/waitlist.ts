import * as crypto from "crypto";

import axios from "axios";
import { Request, Response, Router } from "express";

import { db } from "~db";
import { assertDefined } from "~shared/assert";
import logger from "~shared/logger";

import { HttpStatus } from "../http";

const mailchimpApiKey = assertDefined(process.env.MAILCHIMP_API_KEY, "MAILCHIMP_API_KEY is required");

export const router = Router();

interface SignupPayload {
  email?: string;
  firstName?: string;
}

type MembersApiPutRequestBody = {
  email_address: string;
  status_if_new: "subscribed";
  merge_fields?: Record<string, string>;
};

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
    const membersApiQueryBody: MembersApiPutRequestBody = {
      email_address: email.toLowerCase().trim(),
      status_if_new: "subscribed",
    };
    if (firstName) {
      membersApiQueryBody.merge_fields = { FNAME: firstName };
    }
    const emailMd5Hash = crypto.createHash("md5").update(email).digest("hex").toString();
    await axios.put(
      `https://us17.api.mailchimp.com/3.0/lists/b989557221/members/${emailMd5Hash}`,
      JSON.stringify(membersApiQueryBody),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`user:${mailchimpApiKey}`).toString("base64")}`,
        },
        params: {
          skip_merge_validation: true,
        },
      }
    );
    logger.info(`Mailchimp create subscriber API call successful`);
  } catch (e) {
    console.error(e);
    logger.error("Adding a new subscriber failed");
    return res.status(HttpStatus.CONFLICT).end();
  }
});
