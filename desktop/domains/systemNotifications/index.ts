import { createCleanupObject } from "@aca/shared/cleanup";

import { initializeListNotificationsScheduling } from "./listScheduler";
import { initializeReminderNotificationsScheduling } from "./reminders";

export function initializeDesktopNotifications() {
  const cleanup = createCleanupObject();

  cleanup.next = initializeListNotificationsScheduling();

  cleanup.next = initializeReminderNotificationsScheduling();

  return cleanup.clean;
}
