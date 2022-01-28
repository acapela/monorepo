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

  return {
    kind: "definedList" as const,
    id,
    name,
    getAllNotifications,
    getNotificationIndex,
    getNextNotification,
    getPreviousNotification,
  };
}

export type DefinedList = ReturnType<typeof defineList>;

export function getIsDefinedList(input: unknown): input is DefinedList {
  unsafeAssertType<DefinedList>(input);

  return input?.kind === "definedList";
}
