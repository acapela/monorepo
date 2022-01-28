import { computed } from "mobx";

import { getDb } from "@aca/desktop/clientdb";

export const unresolvedNotificationsComputed = computed(() => {
  const db = getDb();

  const unresolvedNotifications = db.notification.query({ resolved_at: null }).all;
  return unresolvedNotifications.filter((notification) => notification.inner);
});
