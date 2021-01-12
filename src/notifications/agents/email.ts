import logger from "../../logger";
import { NotificationMeta } from "../UserNotification";
import sgMail from "@sendgrid/mail";
import { MailDataRequired } from "@sendgrid/helpers/classes/mail";
import config from "../../config";

sgMail.setApiKey(config.get("sendgrid.apiKey"));

export default function SendEmailNotification(content: MailDataRequired, notificationMeta: NotificationMeta): void {
  logger.info(`Notification is about to be sent`, {
    name: notificationMeta.name,
    recipient: content.to,
  });

  try {
    sgMail.send(content, true);
  } catch (e) {
    throw new Error(`Failed to send notification ${notificationMeta.name} to ${content.to}, the following error ocurred:
        ${e}`);
  }
}
