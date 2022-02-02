import { NotificationEntity } from "@aca/desktop/clientdb/notification";

import { NotificationsGroup, getIsNotificationsGroup } from "./group";
import { getNotificationGroupTarget } from "./target";

export type NotificationOrGroup = NotificationEntity | NotificationsGroup;

export function groupNotifications(notifications: NotificationEntity[]): NotificationOrGroup[] {
  const result: NotificationOrGroup[] = [];

  notifications.forEach((notification) => {
    const target = getNotificationGroupTarget(notification);

    if (!target) {
      result.push(notification);
      return;
    }

    const existingGroup = result
      .map((result) => (getIsNotificationsGroup(result) ? result : null))
      .find((group) => group?.id === target.id);

    if (existingGroup) {
      existingGroup.notifications.push(notification);
      return;
    }

    result.push({
      kind: "group",
      ...target,
      notifications: [notification],
    });
  });

  const onlyGroupWithMultipleItems = result.map((notificationOrGroup): NotificationOrGroup => {
    if (getIsNotificationsGroup(notificationOrGroup)) {
      if (notificationOrGroup.notifications.length === 1) {
        const [onlyNotificationInGroup] = notificationOrGroup.notifications;
        return onlyNotificationInGroup;
      }
    }

    return notificationOrGroup;
  });

  return onlyGroupWithMultipleItems;
}
