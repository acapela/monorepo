import { db } from "~db";
import { NotificationPayload, NotificationType, createNotificationData } from "~shared/notifications/types";

interface CreateNotificationInput<T extends NotificationType> {
  type: T;
  payload: NotificationPayload<T>;
  userId: string;
}

export function createNotification<T extends NotificationType>({ type, payload, userId }: CreateNotificationInput<T>) {
  const notificationData = createNotificationData(type, payload);
  return db.notification.create({
    data: { data: notificationData, user_id: userId },
  });
}
