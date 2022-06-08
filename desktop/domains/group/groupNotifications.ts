import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { unsafeAssertType } from "@aca/shared/assert";

import { NotificationsGroup, getIsNotificationsGroup, getNotificationsGroupMeta } from "./group";
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

/**
 * Will group notification so if 2+ are related to the same 'target', they'll be bundled together
 */
export function groupNotifications(notifications: NotificationEntity[]): NotificationOrGroup[] {
  const result: NotificationOrGroup[] = [];

  notifications.forEach((notification) => {
    const target = getNotificationGroupTarget(notification, notifications);

    // Should not happen - but consider as single notification then
    if (!target) {
      result.push(notification);
      return;
    }

    // Try to get existing group if such exists
    const existingGroup = result
      .map((result) => (getIsNotificationsGroup(result) ? result : null))
      .find((group) => group?.id === target.id);

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
        return getNotificationsGroupMeta(notification);
      },
    };

    // Create new group
    result.push(group);
  });

  /**
   * It is now possible that we have groups containing only one notification.
   *
   * If so, convert such group to 'flat' notification only.
   */
  const onlyGroupWithMultipleItems = result.map((notificationOrGroup): NotificationOrGroup => {
    // It is not a group
    if (!getIsNotificationsGroup(notificationOrGroup)) return notificationOrGroup;

    // It has multiple notifications
    if (notificationOrGroup.notifications.length > 1) return notificationOrGroup;

    const [onlyNotificationInGroup] = notificationOrGroup.notifications;
    return onlyNotificationInGroup;
  });

  return onlyGroupWithMultipleItems;
}
