import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { NotificationsList } from "@aca/desktop/domains/list/defineList";

import { NotificationsGroup, getIsNotificationsGroup } from "./group";
import { groupNotifications } from "./groupNotifications";

export function getNotificationParentGroupInList(
  notification: NotificationEntity,
  list: NotificationsList
): NotificationsGroup | null {
  const groupsList = groupNotifications(list.getAllNotifications());

  const groups = groupsList.filter(getIsNotificationsGroup);

  return groups.find((group) => group.notifications.includes(notification)) ?? null;
}
