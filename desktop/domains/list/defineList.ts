import { orderBy } from "lodash";
import { ReactNode } from "react";

import { cachedComputed } from "@aca/clientdb";
import { EntityFilterInputByDefinition } from "@aca/clientdb/entity/query";
import { getDb } from "@aca/desktop/clientdb";
import { NotificationListEntity } from "@aca/desktop/clientdb/list";
import { NotificationEntity, getReverseTime, notificationEntity } from "@aca/desktop/clientdb/notification";
import { NotificationsGroup, getIsNotificationsGroup } from "@aca/desktop/domains/group/group";
import { NotificationOrGroup, groupNotifications } from "@aca/desktop/domains/group/groupNotifications";
import { uiStore } from "@aca/desktop/store/ui";
import { findAndMap } from "@aca/shared/array";
import { assert, unsafeAssertType } from "@aca/shared/assert";
import { None } from "@aca/shared/none";

type DefineListConfig = {
  id: string;
  name: string;
  icon?: ReactNode;
  isCustom?: boolean;
  listEntity?: NotificationListEntity;
  dontShowCount?: boolean;
} & (
  | { getNotifications: () => NotificationEntity[] }
  | { filter: EntityFilterInputByDefinition<typeof notificationEntity> }
);

// For non-grouped notifications the index is a single number
// For grouped notifications the index is a number tuple, containing both the group's index and the within group index
type GroupedNotificationsIndex = number | [number, number];

export function defineNotificationsList({
  id,
  name,
  isCustom,
  listEntity,
  icon,
  dontShowCount = false,
  ...config
}: DefineListConfig) {
  const getActiveNotification = cachedComputed(() => (uiStore.activeListId === id ? uiStore.activeNotification : null));

  const getRawNotificationsQuery = cachedComputed(function getRawNotificationsQuery() {
    const db = getDb();

    let notifications = "filter" in config ? db.notification.find(config.filter) : config.getNotifications();

    // Retains the active notification in the active list, to enable navigating to the next/previous notification
    const activeNotification = getActiveNotification();
    if (activeNotification && !notifications.some((n) => n == activeNotification)) {
      notifications = orderBy([...notifications, activeNotification], (n) => getReverseTime(n.created_at));
    }
    return notifications;
  });

  const getAllGroupedNotifications = cachedComputed(function getAllGroupedNotifications() {
    const groups = groupNotifications(getRawNotificationsQuery());
    return groups;
  });

  const getFlattenedNotifications = cachedComputed(function getFlattenedNotifications() {
    return getAllGroupedNotifications().flatMap((notificationOrGroup) =>
      getIsNotificationsGroup(notificationOrGroup) ? notificationOrGroup.notifications : [notificationOrGroup]
    );
  });

  const getNotificationIndex = cachedComputed(function getNotificationIndex(notification: NotificationEntity) {
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

  const getAdjacentNotification = cachedComputed(function getAdjacentNotification(
    notification: NotificationEntity,
    direction: -1 | 1
  ) {
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

  const getNextNotification = cachedComputed(function getNextNotification(notification: NotificationEntity) {
    return getAdjacentNotification(notification, +1);
  });

  const getPreviousNotification = cachedComputed(function getPreviousNotification(notification: NotificationEntity) {
    return getAdjacentNotification(notification, -1);
  });

  const NOTIFICATIONS_TO_PRELOAD_COUNT = 4;
  const getNotificationsToPreload = cachedComputed(function getNotificationsToPreload(
    focusedNotification?: NotificationEntity
  ) {
    const notificationsToPreload = focusedNotification ? [focusedNotification] : [];

    const [firstNotificationOrGroup] = getAllGroupedNotifications();

    if (!firstNotificationOrGroup) {
      return notificationsToPreload;
    }

    const firstNotification = getIsNotificationsGroup(firstNotificationOrGroup)
      ? firstNotificationOrGroup.notifications[0]
      : firstNotificationOrGroup;
    // We limit the amount of notifications to preload to the previous one and the next 3

    if (focusedNotification) {
      const previous = getPreviousNotification(focusedNotification);

      if (previous) {
        notificationsToPreload.push(previous);
      }
    }

    let currentNotification = focusedNotification ?? firstNotification;

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

  const getCountIndicator = cachedComputed(() => {
    return getAllGroupedNotifications().reduce((count, groupOrNotification) => {
      if (getIsNotificationsGroup(groupOrNotification)) {
        if (groupOrNotification.isOnePreviewEnough) {
          return count + 1;
        }

        return count + groupOrNotification.notifications.length;
      }

      return count + 1;
    }, 0);
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
    get name() {
      return listEntity?.title ?? name;
    },
    isCustom,
    getNotificationGroup,
    getAllGroupedNotifications,
    getAllNotifications: getFlattenedNotifications,
    getNotificationIndex,
    getNextNotification,
    getPreviousNotification,
    getCountIndicator,
    getNotificationsToPreload,
    listEntity,
    icon,
    dontShowCount,
  };
}

export type NotificationsList = ReturnType<typeof defineNotificationsList>;

export function getIsNotificationsList(input: unknown): input is NotificationsList {
  unsafeAssertType<NotificationsList>(input);

  return input?.kind === "notificationsList";
}
