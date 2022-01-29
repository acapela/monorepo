import { cachedComputed } from "@aca/clientdb";
import { getDb } from "@aca/desktop/clientdb";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { unsafeAssertType } from "@aca/shared/assert";

interface DefineListConfig {
  id: string;
  name: string;
  filter: (notification: NotificationEntity) => boolean;
}

export function defineList({ id, name, filter }: DefineListConfig) {
  const getAllNotifications = cachedComputed(() => {
    const db = getDb();
    return db.notification.query(filter);
  });

  const getNotificationIndex = cachedComputed((notification: NotificationEntity) => {
    const allNotifications = getAllNotifications().all;

    const index = allNotifications.indexOf(notification);

    if (index === -1) return null;

    return index;
  });

  const getNextNotification = cachedComputed((notification: NotificationEntity) => {
    const index = getNotificationIndex(notification);

    if (index === null) return null;

    return getAllNotifications().all[index + 1] ?? null;
  });

  const getPreviousNotification = cachedComputed((notification: NotificationEntity) => {
    const index = getNotificationIndex(notification);

    if (index === null) return null;

    return getAllNotifications().all[index - 1] ?? null;
  });

  const NOTIFICATIONS_TO_PRELOAD_COUNT = 5;

  const getNotificationsToPreload = cachedComputed((openedNotification?: NotificationEntity) => {
    const allNotifications = getAllNotifications().all;
    if (!openedNotification) {
      return allNotifications.slice(0, NOTIFICATIONS_TO_PRELOAD_COUNT);
    }

    const notificationIndex = getNotificationIndex(openedNotification);

    if (notificationIndex === null) {
      return allNotifications.slice(0, NOTIFICATIONS_TO_PRELOAD_COUNT);
    }

    // We limit the amount of notifications to preload to the previous one and the next 3
    const notificationsToPreload = allNotifications.slice(
      Math.max(notificationIndex - 1, 0),
      notificationIndex + NOTIFICATIONS_TO_PRELOAD_COUNT - 2
    );

    return notificationsToPreload;
  });

  return {
    kind: "definedList" as const,
    id,
    name,
    getAllNotifications,
    getNotificationIndex,
    getNextNotification,
    getPreviousNotification,
    getNotificationsToPreload,
  };
}

export type DefinedList = ReturnType<typeof defineList>;

export function getIsDefinedList(input: unknown): input is DefinedList {
  unsafeAssertType<DefinedList>(input);

  return input?.kind === "definedList";
}
