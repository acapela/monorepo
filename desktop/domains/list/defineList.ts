import { orderBy } from "lodash";
import { ReactNode } from "react";

import { getDb } from "@aca/desktop/clientdb";
import { NotificationListEntity } from "@aca/desktop/clientdb/list";
import { NotificationEntity, notificationEntity } from "@aca/desktop/clientdb/notification";
import { unsafeAssertType } from "@aca/shared/assert";
import { weakMemoize } from "@aca/shared/deepMap";
import { runUntracked } from "@aca/shared/mobx/utils";
import { EntityFindInputByDefinition } from "@acapela/clientdb";
import { cachedComputed } from "@acapela/clientdb";

import { createNotificationsListModel } from "./model";
import { CUSTOM_SYSTEM_LIST_ICONS, ListSystemId } from "./system";

type SortResult = string | number;

type DefineListConfig = {
  id: string;
  name: string;
  icon?: ReactNode;
  listEntity?: NotificationListEntity;
  tip?: ReactNode;
  isHidden?: boolean;
  requiresReconnection?: boolean;
  dontShowCount?: boolean;
  dontPreload?: boolean;
  sort?: (notification: NotificationEntity) => SortResult;
} & (
  | { getNotifications: () => NotificationEntity[] }
  | { filter: EntityFindInputByDefinition<typeof notificationEntity> }
);

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
  isHidden = false,
  requiresReconnection = false,
  sort,
  tip,
  ...config
}: DefineListConfig) {
  const getRawNotificationsQuery = cachedComputed(function getRawNotificationsQuery() {
    const db = getDb();

    const notifications: NotificationEntity[] =
      "filter" in config ? db.entity(notificationEntity).find(config.filter) : config.getNotifications();

    // If we have custom sort - we always apply it
    if (sort) {
      return orderBy(notifications, sort);
    }

    // We don't have custom sort
    if (notifications === notifications) {
      // If we did not append custom active item - no need to re-sort
      return notifications;
    }

    // We did add active item - we need to sort again
    return orderBy(notifications, (n) => -getNotificationCreatedAtTimestamp(n));
  });

  const model = createNotificationsListModel(getRawNotificationsQuery);

  return {
    kind: "notificationsList" as const,
    id,
    get name() {
      return listEntity?.title ?? name;
    },
    get systemId() {
      return listEntity?.system_id ?? null;
    },
    dontPreload,
    ...model,
    listEntity,
    tip,
    get icon() {
      if (listEntity?.system_id) {
        return CUSTOM_SYSTEM_LIST_ICONS[listEntity.system_id as ListSystemId];
      }
      return listEntity?.emoji ?? icon;
    },
    dontShowCount,
    isHidden,
    requiresReconnection,
  };
}

export type NotificationsList = ReturnType<typeof defineNotificationsList>;

export function getIsNotificationsList(input: unknown): input is NotificationsList {
  unsafeAssertType<NotificationsList>(input);

  return input?.kind === "notificationsList";
}
