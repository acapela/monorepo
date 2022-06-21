import { autorun } from "mobx";

import { applicationWideSettingsBridge } from "@aca/desktop/bridge/system";
import { getNullableDb } from "@aca/desktop/clientdb";
import { createCleanupObject } from "@aca/shared/cleanup";

import { initializeListNotificationsScheduling } from "./listScheduler";
import { requestNotificationsPermissionIfNeeded } from "./permission";
import { initializeReminderNotificationsScheduling } from "./reminders";

function askForNotificationPermissionWhenNeeded() {
  const stop = autorun(() => {
    const { enableDesktopNotifications } = applicationWideSettingsBridge.get();

    if (!enableDesktopNotifications) return;

    const allLists = getNullableDb()?.notificationList.all ?? [];

    for (const list of allLists) {
      if (typeof list.notifications_interval_ms === "number") {
        stop();
        requestNotificationsPermissionIfNeeded();
      }
    }
  });

  return stop;
}

export function initializeDesktopNotifications() {
  const cleanup = createCleanupObject();

  cleanup.next = askForNotificationPermissionWhenNeeded();
  cleanup.next = initializeListNotificationsScheduling();
  cleanup.next = initializeReminderNotificationsScheduling();

  return cleanup.clean;
}
