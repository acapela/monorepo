import { orderBy } from "lodash";
import { ReactNode } from "react";

import { cachedComputed } from "@aca/clientdb";
import { EntityFilterInputByDefinition } from "@aca/clientdb/entity/query";
import { getDb } from "@aca/desktop/clientdb";
import { NotificationListEntity } from "@aca/desktop/clientdb/list";
import { NotificationEntity, notificationEntity } from "@aca/desktop/clientdb/notification";
import { NotificationsGroup, getIsNotificationsGroup } from "@aca/desktop/domains/group/group";
import { NotificationOrGroup, groupNotifications } from "@aca/desktop/domains/group/groupNotifications";
import { uiStore } from "@aca/desktop/store/ui";
import { findAndMap } from "@aca/shared/array";
import { assert, unsafeAssertType } from "@aca/shared/assert";
import { weakMemoize } from "@aca/shared/deepMap";
import { runUntracked } from "@aca/shared/mobx/utils";
import { None } from "@aca/shared/none";

import { getCountIndicatorFromGroups } from "./count";
import { CUSTOM_SYSTEM_LIST_ICONS, ListSystemId } from "./system";

type SortResult = string | number;

type DefineListConfig = {
  id: string;
  name: string;
  icon?: ReactNode;
  listEntity?: NotificationListEntity;
  tip?: ReactNode;
  dontShowCount?: boolean;
  dontPreload?: boolean;
  sort?: (notification: NotificationEntity) => SortResult;
} & (
  | { getNotifications: () => NotificationEntity[] }
  | { filter: EntityFilterInputByDefinition<typeof notificationEntity> }
);

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
 * We assume created_at never changes so:
 * we don't need to track it to avoid creating observable connections
 * we can memoize the result per notification
 */
const getNotificationCreatedAtTimestamp = weakMemoize((notification: NotificationEntity) => {
  return runUntracked(() => new Date(notification.created_at).getTime());
});

export function defineNotificationsList({
  id,
  name,
  listEntity,
  icon,
  dontShowCount = false,
  dontPreload = false,
  sort,
  tip,
  ...config
}: DefineListConfig) {
  const getActiveNotification = cachedComputed(() => (uiStore.activeListId === id ? uiStore.activeNotification : null));

  const getRawNotificationsQuery = cachedComputed(function getRawNotificationsQuery() {
    const db = getDb();

    const notifications: NotificationEntity[] =
      "filter" in config ? db.notification.find(config.filter) : config.getNotifications();

    // It is possible we'll add active notification - but only if we do - we need to adjust default sorting
    let notificationsWithActive = notifications;
    // Retains the active notification in the active list, to enable navigating to the next/previous notification
    const activeNotification = getActiveNotification();
    if (activeNotification && !notifications.some((n) => n == activeNotification)) {
      notificationsWithActive = [...notifications, activeNotification];
    }

    // If we have custom sort - we always apply it
    if (sort) {
      return orderBy(notificationsWithActive, sort);
    }

    // We don't have custom sort
    if (notificationsWithActive === notifications) {
      // If we did not append custom active item - no need to re-sort
      return notificationsWithActive;
    }

    // We did add active item - we need to sort again
    return orderBy(notifications, (n) => -getNotificationCreatedAtTimestamp(n));
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
    return getCountIndicatorFromGroups(getAllGroupedNotifications());
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
    dontPreload,
    getNotificationGroup,
    getAllGroupedNotifications,
    getAllNotifications: getFlattenedNotifications,
    getNotificationIndex,
    getNextNotification,
    getPreviousNotification,
    getCountIndicator,
    getNotificationsToPreload,
    listEntity,
    tip,
    get icon() {
      if (listEntity?.system_id) {
        return CUSTOM_SYSTEM_LIST_ICONS[listEntity.system_id as ListSystemId];
      }
      return listEntity?.emoji ?? icon;
    },
    dontShowCount,
  };
}

export type NotificationsList = ReturnType<typeof defineNotificationsList>;

export function getIsNotificationsList(input: unknown): input is NotificationsList {
  unsafeAssertType<NotificationsList>(input);

  return input?.kind === "notificationsList";
}
