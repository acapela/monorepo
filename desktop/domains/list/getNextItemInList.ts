import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { getIsNotificationsGroup } from "@aca/desktop/domains/group/group";
import { groupNotifications } from "@aca/desktop/domains/group/groupNotifications";

import { NotificationsList } from "./defineList";

export function getGroupedAndOrderedNotificationsInList(list: NotificationsList): NotificationEntity[] {
  const groupedList = groupNotifications(list.getAllNotifications());

  const result: NotificationEntity[] = [];

  groupedList.forEach((notificationOrGroup) => {
    if (getIsNotificationsGroup(notificationOrGroup)) {
      result.push(...notificationOrGroup.notifications);
      return;
    }
    result.push(notificationOrGroup);
  });

  return result;
}
