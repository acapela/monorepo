import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { DefinedList } from "@aca/desktop/domains/list/defineList";

import { NotificationsGroup, getIsNotificationsGroup } from "./group";
import { groupNotifications } from "./groupNotifications";

export function getNotificationParentGroupInList(
  notification: NotificationEntity,
  list: DefinedList
): NotificationsGroup | null {
  const groupsList = groupNotifications(list.getAllNotifications().all);

  const groups = groupsList.filter(getIsNotificationsGroup);

  return groups.find((group) => group.notifications.includes(notification)) ?? null;
}
