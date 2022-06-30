import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { cachedComputed } from "@acapela/clientdb";

import { getNotificationMeta } from "./meta";

export const getNotificationTitle = cachedComputed((notification: NotificationEntity): string => {
  return getNotificationMeta(notification).title ?? "Notification";
});
