import { cachedComputed } from "@aca/clientdb";
import { getDb } from "@aca/desktop/clientdb";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { fuzzySearch } from "@aca/shared/fuzzy/fuzzySearch";

import { getNotificationTitle } from "./title";

export const getNotificationSearchTerms = cachedComputed((notification: NotificationEntity) => {
  const title = getNotificationTitle(notification);

  return [title];
});

export function notificationsFuzzySearch(keyword: string) {
  if (!keyword.length) return [];

  return fuzzySearch(getDb().notification.all, getNotificationSearchTerms, keyword, 0.1);
}
