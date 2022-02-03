import { NotificationEntity } from "@aca/desktop/clientdb/notification";

import { NotificationsGroup, getIsNotificationsGroup } from "./group";
import { getNotificationGroupTarget } from "./target";

export type NotificationOrGroup = NotificationEntity | NotificationsGroup;

/**
 * Will group notification so if 2+ are related to the same 'target', they'll be bundled together
 */
export function groupNotifications(notifications: NotificationEntity[]): NotificationOrGroup[] {
  const result: NotificationOrGroup[] = [];

  notifications.forEach((notification) => {
    const target = getNotificationGroupTarget(notification);

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

    // Create new group
    result.push({
      kind: "group",
      ...target,
      notifications: [notification],
    });
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

export function orderNotificationsByGroups(notifications: NotificationEntity[]) {
  const groupedList = groupNotifications(notifications);

  const result: NotificationOrGroup[] = [];

  groupedList.forEach((notificationOrGroup) => {
    if (getIsNotificationsGroup(notificationOrGroup)) {
      result.push(...notificationOrGroup.notifications);
      return;
    }

    result.push(notificationOrGroup);
  });

  return result;
}
