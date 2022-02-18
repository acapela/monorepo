import { commaListsAnd, oneLine } from "common-tags";
import { isEqual, maxBy } from "lodash";

import { cachedComputed } from "@aca/clientdb";
import { applicationWideSettingsBridge } from "@aca/desktop/bridge/system";
import { getDb, getNullableDb } from "@aca/desktop/clientdb";
import { NotificationListEntity } from "@aca/desktop/clientdb/list";
import { areArraysShallowEqual } from "@aca/shared/array";
import { createCleanupObject } from "@aca/shared/cleanup";
import { niceFormatTimeAndDateIfNeeded } from "@aca/shared/dates/format";
import { autorunEffect } from "@aca/shared/mobx/utils";
import { getTotal } from "@aca/shared/numbers";
import { pluralize } from "@aca/shared/text/pluralize";
import { HOUR, MINUTE } from "@aca/shared/time";

import { BundledItem, bundleScheduledItems } from "./bundle";
import { getNextScheduledDate } from "./schedule";
import { scheduleNotification } from "./systemNotification";
import { ScheduledNotification } from "./types";

const INTERVAL = HOUR * 3;

const MAX_DISTANCE_TO_BUNDLE = MINUTE * 15;

function getNextNotificationDateForList(list: NotificationListEntity): Date | null {
  return getNextScheduledDate({ workStartHour: 9, workEndHour: 17, intervalInMs: INTERVAL });
}

type BundledListsNotification = BundledItem<NotificationListEntity, ScheduledNotification>;

const bundleListNotifications = cachedComputed(
  function bundleListNotifications(lists: NotificationListEntity[]): BundledListsNotification[] {
    return bundleScheduledItems<NotificationListEntity, ScheduledNotification>(
      lists,
      (list) => getNextNotificationDateForList(list)!,
      (listsWithCloseNotifications, date) => {
        if (listsWithCloseNotifications.length === 1) {
          const [list] = listsWithCloseNotifications;

          const latestNotification = maxBy(list.inboxNotifications.all, (n) => new Date(n.created_at))!;

          return {
            date,
            title: pluralize`${list.inboxNotifications.count} ${["notification"]} in list ${list.title}`,
            body: `Last from ${niceFormatTimeAndDateIfNeeded(new Date(latestNotification.created_at))}`,
          };
        }

        const totalNotifications = getTotal(listsWithCloseNotifications, (list) => list.inboxNotifications.count);

        return {
          date,
          body: commaListsAnd`${listsWithCloseNotifications.map((l) => l.title)}`,
          title: oneLine`
          ${pluralize`${totalNotifications} ${["notification"]}`} 
          in
          ${pluralize`${listsWithCloseNotifications.length} ${["list"]}`}
        `,
        };
      },
      MAX_DISTANCE_TO_BUNDLE
    );
  },
  { equals: isEqual }
);

function doesListNeedNotification(list: NotificationListEntity) {
  return list.notifications.hasItems && !!getNextNotificationDateForList(list);
}

const getListsToScheduleNotifications = cachedComputed(
  function getListsToScheduleNotifications() {
    const db = getDb();

    const allLists = db.notificationList.all;

    const listsToScheduleNotifications = allLists.filter((list) => {
      if (!doesListNeedNotification(list)) return false;

      return true;
    });

    return listsToScheduleNotifications;
  },
  { equals: areArraysShallowEqual }
);

function tryToScheduleNextNotifications() {
  const cleanup = createCleanupObject();
  const listsToScheduleNotifications = getListsToScheduleNotifications();

  const notifications = bundleListNotifications(listsToScheduleNotifications);

  notifications.forEach((bundledNotification) => {
    const { bundled: notification } = bundledNotification;

    const scheduleResult = scheduleNotification(notification);

    if (!scheduleResult) {
      // Could be dismissed due to being spammy
      return;
    }

    const [, cancelNotification] = scheduleResult;

    cleanup.next = cancelNotification;
  });

  return cleanup.clean;
}

export function initializeListNotificationsScheduling() {
  return autorunEffect(() => {
    if (!applicationWideSettingsBridge.get().enableDesktopNotifications) {
      return;
    }

    if (!getNullableDb()) return;

    return tryToScheduleNextNotifications();
  });
}
