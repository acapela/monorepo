import sendgrid, { MailDataRequired } from "@sendgrid/mail";
import config from "../config";
import { InternalServerError } from "../errors";

sendgrid.setApiKey(config.get("sendgrid.apiKey"));

export async function sendEmail(email: MailDataRequired, isMultiple?: boolean): Promise<void> {
  try {
    await sendgrid.send(email, isMultiple);
  } catch (e) {
    throw new InternalServerError("Sending email failed");
  }
}
