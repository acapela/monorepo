import sendgrid, { MailDataRequired } from "@sendgrid/mail";
import { InternalServerError } from "../errors";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function sendEmail(email: MailDataRequired, isMultiple?: boolean): Promise<void> {
  try {
    await sendgrid.send(email, isMultiple);
  } catch (e) {
    throw new InternalServerError("Sending email failed");
  }
}
