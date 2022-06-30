import { sortBy, uniq } from "lodash";

import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { cachedComputed } from "@acapela/clientdb";

export const collectFromInfo = cachedComputed(function collectFromInfo(items: NotificationEntity[]) {
  const fromMap = new Map<string, NotificationEntity[]>();

  for (const item of items) {
    const from = item.from;

    let currentList = fromMap.get(from);

    if (!currentList) {
      currentList = [];
      fromMap.set(from, currentList);
    }

    currentList.push(item);
  }

  const fromInfo = Array.from(fromMap.entries()).map(([from, notifications]) => {
    return {
      from,
      notifications: uniq(notifications),
    };
  });

  return sortBy(fromInfo, (info) => -1 * info.notifications.length);
});
