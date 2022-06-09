import { sortBy } from "lodash";

import { cachedComputed } from "@aca/clientdb";
import { NotificationOrGroup } from "@aca/desktop/domains/group/groupNotifications";
import { getNotificationMeta } from "@aca/desktop/domains/notification/meta";

import { NotificationTag } from "./tag";

function getItemTags(item: NotificationOrGroup): NotificationTag[] | undefined {
  if (item.kind === "group") {
    return getNotificationMeta(item.notifications[0]).tags;
  }

  return getNotificationMeta(item).tags;
}

export const collectTags = cachedComputed((items: NotificationOrGroup[]): NotificationTag[] => {
  const allTags = new Set<NotificationTag>();
  // We will sort tags by how often they were used
  const tagUsedCount = new WeakMap<NotificationTag, number>();

  function markAsUsed(tag: NotificationTag) {
    tagUsedCount.set(tag, (tagUsedCount.get(tag) ?? 0) + 1);
  }

  for (const item of items) {
    const itemTags = getItemTags(item);

    if (itemTags) {
      for (const tag of itemTags) {
        markAsUsed(tag);
        allTags.add(tag);
      }
    }
  }

  const allUSedTags = Array.from(allTags);

  return sortBy(allUSedTags, (tag) => {
    return -1 * tagUsedCount.get(tag)!;
  });
});
