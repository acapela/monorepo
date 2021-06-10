import sendgrid, { MailDataRequired } from "@sendgrid/mail";
import { assertGet } from "./assert";

const sendgridApiKey = assertGet(
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
