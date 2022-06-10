import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { unsafeAssertType } from "@aca/shared/assert";

import { NotificationsGroup, getNotificationsGroupMeta } from "./group";
import { getNotificationGroupTarget } from "./target";

export type NotificationOrGroup = NotificationEntity | NotificationsGroup;

export function getIsNotificationOrGroup(input: unknown): input is NotificationOrGroup {
  if (!input) return false;
  unsafeAssertType<NotificationOrGroup>(input);

  if (input.kind === "group") return true;

  unsafeAssertType<NotificationEntity>(input);

  if (input.__typename === "notification") return true;

  return false;
}

function modifySingleItemGroupsToNotifications(groups: NotificationsGroup[]) {
  return groups.map((group): NotificationOrGroup => {
    // It has multiple notifications
    if (group.notifications.length > 1) return group;

    const [onlyNotificationInGroup] = group.notifications;
    return onlyNotificationInGroup;
  });
}

/**
 * Will group notification so if 2+ are related to the same 'target', they'll be bundled together
 */
export function groupNotifications(notifications: NotificationEntity[]): NotificationOrGroup[] {
  const groups: NotificationsGroup[] = [];

  const groupIdMap = new Map<string, NotificationsGroup>();

  notifications.forEach((notification) => {
    const target = getNotificationGroupTarget(notification, notifications);

    const existingGroup = groupIdMap.get(target.id);

    // If group exists - add notification to it
    if (existingGroup) {
      existingGroup.notifications.push(notification);
      return;
    }

    const group: NotificationsGroup = {
      kind: "group",
      ...target,
      notifications: [notification],
      getMeta() {
        return getNotificationsGroupMeta(group);
      },
    };

    groupIdMap.set(group.id, group);

    // Create new group
    groups.push(group);
  });

  return modifySingleItemGroupsToNotifications(groups);
}
