import { Notification } from "./Notification";
import { sendEmail } from "@acapela/shared/email";

export function sendNotification(notification: Notification): Promise<void> {
  return sendEmail({
    from: "acapela@meetnomore.com",
    subject: notification.getSubject(),
    to: notification.getRecipientEmail(),
    html: notification.getContent(),
  });
}
