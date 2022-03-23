import { cachedComputed } from "@aca/clientdb";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { NotificationsList } from "@aca/desktop/domains/list/defineList";

import { NotificationsGroup, getIsNotificationsGroup } from "./group";

export const getNotificationParentGroupInList = cachedComputed(function getNotificationParentGroupInList(
  notification: NotificationEntity,
  list: NotificationsList
): NotificationsGroup | null {
  const groupsList = list.getAllGroupedNotifications();

  const groups = groupsList.filter(getIsNotificationsGroup);

  return groups.find((group) => group.notifications.includes(notification)) ?? null;
});
