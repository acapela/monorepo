import { cachedComputed } from "@aca/clientdb";
import { getDb } from "@aca/desktop/clientdb";
import { NotificationListEntity } from "@aca/desktop/clientdb/list";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { NotificationsGroup, getIsNotificationsGroup } from "@aca/desktop/domains/group/group";
import { NotificationOrGroup, groupNotifications } from "@aca/desktop/domains/group/groupNotifications";
import { findAndMap } from "@aca/shared/array";
import { assert, unsafeAssertType } from "@aca/shared/assert";
import { None } from "@aca/shared/none";
import { isNotNullish } from "@aca/shared/nullish";

interface DefineListConfig {
  id: string;
  name: string;
  isCustom?: boolean;
  filter?: (notification: NotificationEntity) => boolean;
  getNotifications?: () => NotificationEntity[];
  listEntity?: NotificationListEntity;
}

// For non-grouped notifications the index is a single number
// For grouped notifications the index is a number tuple, containing both the group's index and the within group index
type GroupedNotificationsIndex = number | [number, number];

export function defineNotificationsList({
  id,
  name,
  isCustom,
  filter,
  getNotifications,
  listEntity,
}: DefineListConfig) {
  assert(filter || getNotifications, "Defined list has to either include filter or getNotifications handler");

  const getAllNotifications = cachedComputed(() => {
    const db = getDb();

    if (filter) {
      return db.notification.query(filter).all;
    }

    if (getNotifications) {
      return getNotifications();
    }

    return [];
  });

  const getAllGroupedNotifications = cachedComputed(() => {
    return groupNotifications(getAllNotifications());
  });

  const getFlattenedNotifications = cachedComputed(() =>
    getAllGroupedNotifications().flatMap((notificationOrGroup) =>
      getIsNotificationsGroup(notificationOrGroup) ? notificationOrGroup.notifications : [notificationOrGroup]
    )
  );

  const getNotificationIndex = cachedComputed((notification: NotificationEntity) => {
    const groupedNotifications = getAllGroupedNotifications();

    const index: GroupedNotificationsIndex | undefined = findAndMap(groupedNotifications, (notificationOrGroup, i) => {
      if (getIsNotificationsGroup(notificationOrGroup)) {
        const notificationIndex = notificationOrGroup.notifications.indexOf(notification);
        if (notificationIndex != -1) {
          return [i, notificationIndex];
        }
      } else if (notificationOrGroup == notification) {
        return i;
      }
      return None;
    });

    if (index === undefined) return null;

    return index;
  });

  const getAdjacentNotification = cachedComputed((notification: NotificationEntity, direction: -1 | 1) => {
    const index = getNotificationIndex(notification);

    if (index === null) return null;

    const groupedNotifications = getAllGroupedNotifications();
    let nextNotificationOrGroup: NotificationOrGroup;
    if (Array.isArray(index)) {
      const group = groupedNotifications[index[0]];
      assert(getIsNotificationsGroup(group), "must be a notification group");
      const nextNotification = group.notifications[index[1] + direction];
      if (!group.isOnePreviewEnough && nextNotification) {
        return nextNotification;
      }
      nextNotificationOrGroup = groupedNotifications[index[0] + direction];
    } else {
      nextNotificationOrGroup = groupedNotifications[index + direction];
    }

    if (!nextNotificationOrGroup) {
      return null;
    }
    if (getIsNotificationsGroup(nextNotificationOrGroup)) {
      const group = nextNotificationOrGroup;
      return direction == -1 && !group.isOnePreviewEnough
        ? group.notifications[group.notifications.length - 1]
        : group.notifications[0];
    } else {
      return nextNotificationOrGroup;
    }
  });

  const getNextNotification = cachedComputed((notification: NotificationEntity) =>
    getAdjacentNotification(notification, +1)
  );

  const getPreviousNotification = cachedComputed((notification: NotificationEntity) =>
    getAdjacentNotification(notification, -1)
  );

  const NOTIFICATIONS_TO_PRELOAD_COUNT = 4;
  const getNotificationsToPreload = cachedComputed((openedNotification?: NotificationEntity) => {
    const [firstNotificationOrGroup] = getAllGroupedNotifications();
    if (!firstNotificationOrGroup) {
      return [];
    }
    const firstNotification = getIsNotificationsGroup(firstNotificationOrGroup)
      ? firstNotificationOrGroup.notifications[0]
      : firstNotificationOrGroup;
    // We limit the amount of notifications to preload to the previous one and the next 3
    const notificationsToPreload = openedNotification
      ? [getPreviousNotification(openedNotification)].filter(isNotNullish)
      : [];
    let currentNotification = openedNotification ?? firstNotification;
    for (let i = 0; i < NOTIFICATIONS_TO_PRELOAD_COUNT - notificationsToPreload.length; i++) {
      const nextNotification = getNextNotification(currentNotification);
      if (!nextNotification) {
        break;
      }
      notificationsToPreload.push(nextNotification);
      currentNotification = nextNotification;
    }
    return notificationsToPreload;
  });

  const getNotificationGroup = (notification: NotificationEntity) => {
    const groups = getAllGroupedNotifications();

    return groups.find((groupOrNotification) => {
      if (groupOrNotification.kind === "group") {
        return groupOrNotification.notifications.some((n) => n.id === notification.id);
      }
      return false;
    }) as NotificationsGroup | undefined;
  };

  return {
    kind: "notificationsList" as const,
    id,
    name,
    isCustom,
    getNotificationGroup,
    getAllNotifications: getFlattenedNotifications,
    getNotificationIndex,
    getNextNotification,
    getPreviousNotification,
    getNotificationsToPreload,
    listEntity,
  };
}

export type NotificationsList = ReturnType<typeof defineNotificationsList>;

export function getIsNotificationsList(input: unknown): input is NotificationsList {
  unsafeAssertType<NotificationsList>(input);

  return input?.kind === "notificationsList";
}
