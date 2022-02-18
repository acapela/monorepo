import { commaListsAnd, oneLineInlineLists } from "common-tags";
import { isEqual, maxBy } from "lodash";

import { cachedComputed } from "@aca/clientdb";
import { applicationWideSettingsBridge } from "@aca/desktop/bridge/system";
import { getDb, getNullableDb } from "@aca/desktop/clientdb";
import { NotificationListEntity } from "@aca/desktop/clientdb/list";
import { createCleanupObject } from "@aca/shared/cleanup";
import { niceFormatTimeAndDateIfNeeded } from "@aca/shared/dates/format";
import { createLogger } from "@aca/shared/log";
import { autorunEffect } from "@aca/shared/mobx/utils";
import { getTotal } from "@aca/shared/numbers";
import { pluralize } from "@aca/shared/text/pluralize";
import { MINUTE, SECOND } from "@aca/shared/time";

import { getNotificationTitle } from "../notification/title";
import { BundledItem, bundleScheduledItems } from "./bundle";
import { getNextScheduledDate } from "./schedule";
import { scheduleNotification } from "./systemNotification";
import { ScheduledNotification } from "./types";

const MAX_DISTANCE_TO_BUNDLE = MINUTE * 15;

const log = createLogger("List notifications scheduler", false);

function getNextListNotificationWindow(list: NotificationListEntity): Date | null {
  // Notification disabled
  if (list.notifications_interval_ms === null) return null;

  // If want notification instantly - still batch them just a little bit
  if (list.notifications_interval_ms === 0) {
    return getNextScheduledDate({ workStartHour: 9, workEndHour: 17, intervalInMs: SECOND * 10 });
  }

  return getNextScheduledDate({ workStartHour: 9, workEndHour: 17, intervalInMs: list.notifications_interval_ms });
}

type BundledListsNotification = BundledItem<NotificationListEntity, ScheduledNotification>;

const bundleListNotifications = cachedComputed(
  function bundleListNotifications(lists: NotificationListEntity[]): BundledListsNotification[] {
    return bundleScheduledItems<NotificationListEntity, ScheduledNotification>(
      lists,
      (list) => getNextListNotificationWindow(list)!,
      (listsWithCloseNotifications, date) => {
        if (listsWithCloseNotifications.length === 1) {
          const [list] = listsWithCloseNotifications;

          const newNotifications = list.inboxNotificationsSinceLastSeen;

          const getBody = () => {
            const notifications = newNotifications.all;

            if (!notifications.length) return;

            if (notifications.length === 1) {
              const [notification] = notifications;

              return `${getNotificationTitle(notification)} from ${notification.from}`;
            }

            const latestNotification = maxBy(newNotifications.all, (n) => new Date(n.created_at));

            return `Last from ${niceFormatTimeAndDateIfNeeded(new Date(latestNotification?.created_at ?? date))}`;
          };

          return {
            date,
            title: pluralize`${newNotifications.count} ${["notification"]} in list ${list.title}`,
            body: getBody(),
          };
        }

        const totalNotifications = getTotal(
          listsWithCloseNotifications,
          (list) => list.inboxNotificationsSinceLastSeen.count
        );

        return {
          date,
          body: commaListsAnd`${listsWithCloseNotifications.map((l) => l.title)}`,
          title: oneLineInlineLists`
          ${pluralize`${totalNotifications} ${["notification"]}`} 
          in
          ${pluralize`${listsWithCloseNotifications.length} ${["list", "lists"]}`}
        `,
        };
      },
      MAX_DISTANCE_TO_BUNDLE
    );
  },
  { equals: isEqual }
);

const doesListNeedNotification = cachedComputed(function doesListNeedNotification(list: NotificationListEntity) {
  if (!getNextListNotificationWindow(list)) {
    log(`list ${list.title} has notifications disabled`, list);
    return false;
  }

  if (!list.inboxNotificationsSinceLastSeen.hasItems) {
    log(`list ${list.title} has no new notifications since last seen`);
    return false;
  }

  return true;
});

const getListsToScheduleNotifications = cachedComputed(() =>
  getDb().notificationList.query((list) => {
    // ! Don't convert it to filter(doesListNeedNotification) - it'd break caching as it'd pass 3 arguments
    return doesListNeedNotification(list);
  })
);

function tryToScheduleNextNotifications() {
  log("Trying to schedule next batch");
  const notificationCleanups = createCleanupObject();

  const listsToScheduleNotifications = getListsToScheduleNotifications();

  const bundledNotifications = bundleListNotifications(listsToScheduleNotifications.all);

  log("Notifications to schedule", bundledNotifications);

  bundledNotifications.forEach((bundledNotification) => {
    const { bundled: notification } = bundledNotification;

    const [, cancelNotification] = scheduleNotification(notification);

    notificationCleanups.next = cancelNotification;
  });

  return notificationCleanups.clean;
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
