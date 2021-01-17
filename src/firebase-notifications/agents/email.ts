import { MailDataRequired } from "@sendgrid/helpers/classes/mail";
import logger from "../../logger";
import { NotificationMeta } from "../UserNotification";
import { sendEmail } from "../../notifications/emailSender";

export default function SendEmailNotification(content: MailDataRequired, notificationMeta: NotificationMeta): void {
  logger.info(`Notification is about to be sent`, {
    name: notificationMeta.name,
    recipient: content.to,
  });

  try {
    sendEmail(content, true);
  } catch (e) {
    throw new Error(`Failed to send notification ${notificationMeta.name} to ${content.to}, the following error ocurred:
        ${e}`);
  }
}
