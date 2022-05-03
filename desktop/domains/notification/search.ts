import { cachedComputed } from "@aca/clientdb";
import { getDb } from "@aca/desktop/clientdb";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { fuzzySearch } from "@aca/shared/fuzzy/fuzzySearch";

import { getNotificationTitle } from "./title";

export const getNotificationSearchTerms = cachedComputed(function getNotificationSearchTerms(
  notification: NotificationEntity
) {
  const title = getNotificationTitle(notification);

  return [title, notification.from];
});

export function notificationsFuzzySearch(keyword: string) {
  if (!keyword.length) return [];

  return fuzzySearch(getDb().notification.find({ isResolved: false }), getNotificationSearchTerms, keyword, 0.1);
}
