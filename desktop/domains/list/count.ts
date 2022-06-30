import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { getIsNotificationsGroup } from "@aca/desktop/domains/group/group";
import { NotificationOrGroup, groupNotifications } from "@aca/desktop/domains/group/groupNotifications";
import { cachedComputed } from "@acapela/clientdb";

export const getCountIndicatorFromGroups = cachedComputed((groups: NotificationOrGroup[]) => {
  return groups.reduce((count, groupOrNotification) => {
    if (getIsNotificationsGroup(groupOrNotification)) {
      if (groupOrNotification.treatAsOneNotification) {
        return count + 1;
      }

      return count + groupOrNotification.notifications.length;
    }

    return count + 1;
  }, 0);
});

export const getCountIndicatorFromNotifications = cachedComputed((notifications: NotificationEntity[]) => {
  const groups = groupNotifications(notifications);

  return getCountIndicatorFromGroups(groups);
});
