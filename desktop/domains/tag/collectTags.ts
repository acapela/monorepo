import { sortBy, uniq } from "lodash";

import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { NotificationOrGroup } from "@aca/desktop/domains/group/groupNotifications";
import { getNotificationMeta } from "@aca/desktop/domains/notification/meta";
import { cachedComputed } from "@acapela/clientdb";

import { NotificationTag } from "./tag";

function getItemTags(item: NotificationOrGroup): NotificationTag[] | undefined {
  if (item.kind === "group") {
    return getNotificationMeta(item.notifications[0]).tags;
  }

  return getNotificationMeta(item).tags;
}

export interface CollectedTag {
  tag: NotificationTag;
  usedBy: NotificationEntity[];
}

export const collectTags = cachedComputed((items: NotificationEntity[]): CollectedTag[] => {
  const tagUsedBy = new Map<NotificationTag, NotificationEntity[]>();

  function markAsUsed(tag: NotificationTag, by: NotificationEntity) {
    let currentlyUsedBy = tagUsedBy.get(tag);
    if (!currentlyUsedBy) {
      currentlyUsedBy = [];
      tagUsedBy.set(tag, currentlyUsedBy);
    }

    currentlyUsedBy.push(by);
  }

  for (const item of items) {
    const itemTags = getItemTags(item);

    if (itemTags) {
      for (const tag of itemTags) {
        markAsUsed(tag, item);
      }
    }
  }

  const collectedTags = Array.from(tagUsedBy.entries()).map(([tag, usedBy]): CollectedTag => {
    return { tag, usedBy: uniq(usedBy) };
  });

  return sortBy(collectedTags, (collectedTag) => -1 * collectedTag.usedBy.length);
});
