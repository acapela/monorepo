import sendgrid, { MailDataRequired } from "@sendgrid/mail";
import config from "../config";

sendgrid.setApiKey(config.get("sendgrid.apiKey"));

export async function sendEmail(email: MailDataRequired, isMultiple?: boolean): Promise<void> {
  await sendgrid.send(email, isMultiple);
}
