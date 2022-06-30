import { getNullableDb } from "@aca/desktop/clientdb";
import { NotificationEntity, notificationEntity } from "@aca/desktop/clientdb/notification";
import { fuzzySearch } from "@aca/shared/fuzzy/fuzzySearch";
import { isNotNullish } from "@aca/shared/nullish";
import { cachedComputed } from "@acapela/clientdb";

import { getNotificationTitle } from "./title";

export const getNotificationSearchTerms = cachedComputed(function getNotificationSearchTerms(
  notification: NotificationEntity
) {
  const title = getNotificationTitle(notification);

  return [title, notification.from, notification.text_preview].filter(isNotNullish);
});

export function notificationsFuzzySearch(keyword: string) {
  if (!keyword.length) return [];

  const db = getNullableDb();

  if (!db) return [];

  return fuzzySearch(
    db.entity(notificationEntity).find({ isResolved: false }),
    getNotificationSearchTerms,
    keyword,
    0.1
  );
}
