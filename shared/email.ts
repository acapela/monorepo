import sendgrid, { MailDataRequired } from "@sendgrid/mail";

import { assertDefined } from "./assert";

const sendgridApiKey = assertDefined(
  process.env.SENDGRID_API_KEY,
  "Cannot use mailer if there is no SENDGRID_API_KEY env variable."
);

sendgrid.setApiKey(sendgridApiKey);

export async function sendEmail(email: MailDataRequired, isMultiple?: boolean): Promise<void> {
  try {
    await sendgrid.send(email, isMultiple);
  } catch (e) {
    throw new Error("Sending email failed");
  }
}

export const DEFAULT_NOTIFICATION_EMAIL = { name: "Acapela", email: "hello@acape.la" };
