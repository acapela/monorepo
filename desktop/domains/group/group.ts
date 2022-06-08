import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { unsafeAssertType } from "@aca/shared/assert";

import { getNotificationMeta } from "../notification/meta";
import { NotificationOrGroup } from "./groupNotifications";
import { NotificationGroupTarget } from "./target";

export interface NotificationsGroup extends NotificationGroupTarget {
  kind: "group";
  notifications: NotificationEntity[];
}

export function getIsNotificationsGroup(item: unknown): item is NotificationsGroup {
  unsafeAssertType<NotificationsGroup>(item);

  return item && item.kind === "group";
}

export function getNotificationsGroupMeta(group: NotificationOrGroup) {
  if (group.kind === "group") {
    return getNotificationMeta(group.notifications[0]);
  }

  return getNotificationMeta(group);
}
