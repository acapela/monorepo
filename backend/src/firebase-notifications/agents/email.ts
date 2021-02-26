import { MailDataRequired } from "@sendgrid/helpers/classes/mail";
import logger from "@acapela/shared/logger";
import { NotificationMeta } from "../UserNotification";
import { sendEmail } from "../../notifications/emailSender";

export default function SendEmailNotification(content: MailDataRequired, notificationMeta: NotificationMeta): void {
  logger.info(`Notification is about to be sent`, {
    name: notificationMeta.name,
    recipient: content.to,
  });

  try {
    if (process.env.NODE_ENV === "production") {
      sendEmail(content, true);
    } else {
      logger.info(`Not sending notification ${notificationMeta.name} in ${process.env.NODE_ENV} env`);
    }
  } catch (e) {
    logger.info(`Failed to send notification to ${content.to}`, {
      error: e,
    });
    throw new Error(`Failed to send notification ${notificationMeta.name} to ${content.to}, the following error ocurred:
        ${e}`);
  }
}
