import { sendEmail } from "~shared/email";
import { Notification } from "./Notification";

export function sendNotification(notification: Notification): Promise<void> {
  return sendEmail({
    from: "hello@acape.la",
    subject: notification.getSubject(),
    to: notification.getRecipientEmail(),
    html: notification.getContent(),
  });
}
