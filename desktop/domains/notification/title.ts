import { cachedComputed } from "@aca/clientdb";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";

import { getNotificationMeta } from "./meta";

export const getNotificationTitle = cachedComputed((notification: NotificationEntity): string => {
  return getNotificationMeta(notification).title ?? "Notification";
});
