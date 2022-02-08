import { cachedComputed } from "@aca/clientdb";
import { getDb } from "@aca/desktop/clientdb";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { unsafeAssertType } from "@aca/shared/assert";

import { orderNotificationsByGroups } from "../group/groupNotifications";

interface DefineListConfig {
  id: string;
  name: string;
  filter: (notification: NotificationEntity) => boolean;
}

export function defineNotificationsList({ id, name, filter }: DefineListConfig) {
  const getAllNotifications = cachedComputed(() => {
    const db = getDb();
    const rawAll = db.notification.query(filter);

    const orderedAll = orderNotificationsByGroups(rawAll.all);

    return orderedAll;
  });

  const getNotificationIndex = cachedComputed((notification: NotificationEntity) => {
    const allNotifications = orderNotificationsByGroups(getAllNotifications());

    const index = allNotifications.indexOf(notification);

    if (index === -1) return null;

    return index;
  });

  const getNextNotification = cachedComputed((notification: NotificationEntity) => {
    const index = getNotificationIndex(notification);

    if (index === null) return null;

    return getAllNotifications()[index + 1] ?? null;
  });

  const getPreviousNotification = cachedComputed((notification: NotificationEntity) => {
    const index = getNotificationIndex(notification);

    if (index === null) return null;

    return getAllNotifications()[index - 1] ?? null;
  });

  const NOTIFICATIONS_TO_PRELOAD_COUNT = 5;

  const getNotificationsToPreload = cachedComputed((openedNotification?: NotificationEntity) => {
    const orderedNotifications = getAllNotifications();
    if (!openedNotification) {
      return orderedNotifications.slice(0, NOTIFICATIONS_TO_PRELOAD_COUNT);
    }

    const notificationIndex = getNotificationIndex(openedNotification);

    if (notificationIndex === null) {
      return orderedNotifications.slice(0, NOTIFICATIONS_TO_PRELOAD_COUNT);
    }

    // We limit the amount of notifications to preload to the previous one and the next 3
    const notificationsToPreload = orderedNotifications.slice(
      Math.max(notificationIndex - 1, 0),
      notificationIndex + NOTIFICATIONS_TO_PRELOAD_COUNT - 2
    );

    return notificationsToPreload;
  });

  return {
    kind: "notificationsList" as const,
    id,
    name,
    getAllNotifications,
    getNotificationIndex,
    getNextNotification,
    getPreviousNotification,
    getNotificationsToPreload,
  };
}

export type NotificationsList = ReturnType<typeof defineNotificationsList>;

export function getIsNotificationsList(input: unknown): input is NotificationsList {
  unsafeAssertType<NotificationsList>(input);

  return input?.kind === "notificationsList";
}
