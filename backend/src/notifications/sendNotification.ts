import { DEFAULT_NOTIFICATION_EMAIL, sendEmail } from "~shared/email";
import { Notification } from "./Notification";

export function sendNotification(notification: Notification): Promise<void> {
  return sendEmail({
    from: DEFAULT_NOTIFICATION_EMAIL,
    subject: notification.getSubject(),
    to: notification.getRecipientEmail(),
    html: notification.getContent(),
  });
}
