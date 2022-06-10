import { uniq } from "lodash";

import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { unsafeAssertType } from "@aca/shared/assert";
import { isNotNullish } from "@aca/shared/nullish";

import { NotificationMeta, getNotificationMeta } from "../notification/meta";
import { NotificationOrGroup } from "./groupNotifications";
import { NotificationGroupTarget } from "./target";

export interface NotificationsGroup extends NotificationGroupTarget {
  kind: "group";
  notifications: NotificationEntity[];
  getMeta: () => NotificationMeta;
}

export function getIsNotificationsGroup(item: unknown): item is NotificationsGroup {
  unsafeAssertType<NotificationsGroup>(item);

  return item && item.kind === "group";
}

function collectGroupTags(group: NotificationsGroup) {
  return uniq(
    group.notifications
      .map((notification) => getNotificationMeta(notification).tags)
      .flat()
      .filter(isNotNullish)
  );
}

export function getNotificationsGroupMeta(group: NotificationOrGroup): NotificationMeta {
  if (group.kind === "group") {
    const rootMeta = getNotificationMeta(group.notifications[0]);

    return {
      ...rootMeta,
      tags: collectGroupTags(group),
    };
  }

  return getNotificationMeta(group);
}
