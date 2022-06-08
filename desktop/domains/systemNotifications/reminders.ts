import { applicationWideSettingsBridge } from "@aca/desktop/bridge/system";
import { getNullableDb } from "@aca/desktop/clientdb";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { desktopRouter } from "@aca/desktop/routes";
import { createCleanupObject } from "@aca/shared/cleanup";
import { debouncedAutorunEffect } from "@aca/shared/mobx/debouncedAutorun";
import { isNotNullish } from "@aca/shared/nullish";

import { NotificationOrGroup, groupNotifications } from "../group/groupNotifications";
import { savedNotificationsList } from "../list/all";
import { getNotificationTitle } from "../notification/title";
import { scheduleNotification } from "./systemNotification";
import { ScheduledNotification } from "./types";

function prepareNotification(notification: NotificationEntity): ScheduledNotification | null {
  const { reminderDate } = notification;

  if (!reminderDate) return null;

  return {
    date: reminderDate,
    title: `Reminder`,
    body: getNotificationTitle(notification),
    requireInteraction: true,
    onClick() {
      desktopRouter.navigate("focus", {
        listId: savedNotificationsList.id,
        notificationId: notification.id,
      });
    },
  };
}

function getNotificationOrGroupScheduledNotification(
  notificationOrGroup: NotificationOrGroup
): ScheduledNotification | null {
  if (notificationOrGroup.kind === "group") {
    const firstNotification = notificationOrGroup.notifications.find((notification) => notification.hasReminder);

    if (!firstNotification) return null;

    return prepareNotification(firstNotification);
  }

  return prepareNotification(notificationOrGroup);
}

function scheduleReminderNotifications() {
  const db = getNullableDb();

  if (!db) return;

  const notificationsWithReminders = db.notification.find({ hasReminder: true });

  const groupsWithReminders = groupNotifications(notificationsWithReminders);

  const preparedNotifications = groupsWithReminders
    .map(getNotificationOrGroupScheduledNotification)
    .filter(isNotNullish);

  const cleanup = createCleanupObject();

  preparedNotifications.forEach((preparedNotification) => {
    const [, cancel] = scheduleNotification(preparedNotification);

    cleanup.next = cancel;
  });

  return () => {
    cleanup.clean();
  };
}

export function initializeReminderNotificationsScheduling() {
  return debouncedAutorunEffect(() => {
    if (!applicationWideSettingsBridge.get().enableDesktopNotifications) {
      return;
    }

    if (!getNullableDb()) return;

    return scheduleReminderNotifications();
  }, 1000);
}
