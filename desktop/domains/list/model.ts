import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { NotificationsGroup, getIsNotificationsGroup } from "@aca/desktop/domains/group/group";
import { NotificationOrGroup, groupNotifications } from "@aca/desktop/domains/group/groupNotifications";
import { uiStore } from "@aca/desktop/store/ui";
import { findAndMap } from "@aca/shared/array";
import { assert } from "@aca/shared/assert";
import { None } from "@aca/shared/none";
import { cachedComputed, cachedComputedWithoutArgs } from "@acapela/clientdb";

import { collectTags } from "../tag/collectTags";
import { getCountIndicatorFromGroups } from "./count";

// For non-grouped notifications the index is a single number
// For grouped notifications the index is a number tuple, containing both the group's index and the within group index
type GroupedNotificationsIndex = number | [number, number];

function iterateAndCollect<T>(start: T, iterator: (notification: T) => T | null, count: number) {
  const collection = [];
  let current = start;
  for (let i = 0; i < count; i++) {
    const next = iterator(current);
    if (!next) {
      break;
    }
    collection.push(next);
    current = next;
  }
  return collection;
}

/**
 * This is list model to ensure 'next', 'prev', etc parity between list view and focus session
 */
export function createNotificationsListModel(getRawNotificationsQuery: () => NotificationEntity[]) {
  const getGroups = cachedComputed(function getAllGroupedNotifications() {
    const groups = groupNotifications(getRawNotificationsQuery());
    return groups;
  });

  const getFlattenedNotifications = cachedComputed(function getFlattenedNotifications() {
    return getGroups().flatMap((notificationOrGroup) =>
      getIsNotificationsGroup(notificationOrGroup) ? notificationOrGroup.notifications : [notificationOrGroup]
    );
  });

  const getIndexOf = cachedComputed(function getNotificationIndex(notification: NotificationEntity) {
    const groupedNotifications = getGroups();

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

  type Dir = -1 | 1;

  function unwrapGroup(nextNotificationOrGroup: NotificationOrGroup, direction: Dir) {
    if (getIsNotificationsGroup(nextNotificationOrGroup)) {
      const group = nextNotificationOrGroup;
      return direction == -1 && !group.treatAsOneNotification
        ? group.notifications[group.notifications.length - 1]
        : group.notifications[0];
    } else {
      return nextNotificationOrGroup;
    }
  }

  const getAdjacentNotification = cachedComputed(function getAdjacentNotification(
    notification: NotificationEntity,
    direction: -1 | 1
  ) {
    const index = getIndexOf(notification);

    const groupedNotifications = getGroups();

    if (index === null) {
      const firstOrLastItem = groupedNotifications.at(direction === 1 ? 0 : -1);

      if (!firstOrLastItem) {
        return null;
      }

      return unwrapGroup(firstOrLastItem, direction);
    }

    let nextNotificationOrGroup: NotificationOrGroup;
    if (Array.isArray(index)) {
      const group = groupedNotifications[index[0]];
      assert(getIsNotificationsGroup(group), "must be a notification group");
      const nextNotification = group.notifications[index[1] + direction];
      if (!group.treatAsOneNotification && nextNotification) {
        return nextNotification;
      }
      nextNotificationOrGroup = groupedNotifications[index[0] + direction];
    } else {
      nextNotificationOrGroup = groupedNotifications[index + direction];
    }

    if (!nextNotificationOrGroup) {
      return null;
    }

    return unwrapGroup(nextNotificationOrGroup, direction);
  });

  const getNextNotification = cachedComputed(function getNextNotification(notification: NotificationEntity) {
    return getAdjacentNotification(notification, +1);
  });

  const getPreviousNotification = cachedComputed(function getPreviousNotification(notification: NotificationEntity) {
    return getAdjacentNotification(notification, -1);
  });

  const getNotificationsToPreload = cachedComputed(function getNotificationsToPreload(
    focusedNotification?: NotificationEntity
  ) {
    const notificationsToPreload = focusedNotification ? [focusedNotification] : [];

    const [firstNotificationOrGroup] = getGroups();

    if (!firstNotificationOrGroup) {
      return notificationsToPreload;
    }

    const firstNotification = getIsNotificationsGroup(firstNotificationOrGroup)
      ? firstNotificationOrGroup.notifications[0]
      : firstNotificationOrGroup;

    const currentNotification = focusedNotification ?? firstNotification;

    notificationsToPreload.push(
      ...iterateAndCollect(
        currentNotification,
        (notification) => getPreviousNotification(notification),
        uiStore.isAppFocused ? 2 : 0
      ),
      ...iterateAndCollect(
        currentNotification,
        (notification) => getNextNotification(notification),
        uiStore.isAppFocused ? 4 : 1
      )
    );

    return notificationsToPreload;
  });

  const getCountIndicator = cachedComputed(() => {
    return getCountIndicatorFromGroups(getGroups());
  });

  const notificationGroupMap = cachedComputedWithoutArgs(() => {
    const groups = getGroups();

    const notificationGroupMap = new Map<NotificationEntity, NotificationsGroup>();

    for (const group of groups) {
      if (group.kind === "group") {
        for (const groupNotification of group.notifications) {
          notificationGroupMap.set(groupNotification, group);
        }
      }
    }

    return notificationGroupMap;
  });

  const getNotificationGroup = cachedComputed((notification: NotificationEntity) => {
    const notificationGroupMapResult = notificationGroupMap.get();

    return notificationGroupMapResult.get(notification);
  });

  const getCollectedTags = cachedComputed(() => {
    return collectTags(getRawNotificationsQuery());
  });

  return {
    collectTags: getCollectedTags,
    getNotificationGroup,
    getGroups,
    getAllNotifications: getFlattenedNotifications,
    getIndexOf,
    getNextNotification,
    getPreviousNotification,
    getCountIndicator,
    getNotificationsToPreload,
  };
}

export type NotificationsListModel = ReturnType<typeof createNotificationsListModel>;
