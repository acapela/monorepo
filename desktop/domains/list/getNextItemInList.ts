import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { getIsNotificationsGroup } from "@aca/desktop/domains/group/group";
import { NotificationOrGroup, groupNotifications } from "@aca/desktop/domains/group/groupNotifications";
import { openedNotificationsGroupsStore } from "@aca/desktop/domains/group/openedStore";
import { getNextItemInArray, getPreviousItemInArray } from "@aca/shared/array";

import { DefinedList } from "./defineList";

function getVisibleGroupedElementsInList(list: DefinedList): NotificationOrGroup[] {
  const groupedList = groupNotifications(list.getAllNotifications().all);

  const result: NotificationOrGroup[] = [];

  groupedList.forEach((notificationOrGroup) => {
    result.push(notificationOrGroup);
    if (
      getIsNotificationsGroup(notificationOrGroup) &&
      openedNotificationsGroupsStore.getIsOpened(notificationOrGroup.id)
    ) {
      result.push(...notificationOrGroup.notifications);
    }
  });

  return result;
}

export function getGroupedAndOrderedNotificationsInList(list: DefinedList): NotificationEntity[] {
  const groupedList = groupNotifications(list.getAllNotifications().all);

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

export function getNextVisibleItemInList(list: DefinedList, currentItem?: NotificationOrGroup) {
  const visibleElements = getVisibleGroupedElementsInList(list);

  if (!currentItem) return visibleElements[0];

  return getNextItemInArray(visibleElements, currentItem, {
    keyGetter: (item) => (getIsNotificationsGroup(item) ? item.id : item.id),
  });
}

export function getPreviousVisibleItemInList(list: DefinedList, currentItem?: NotificationOrGroup) {
  const visibleElements = getVisibleGroupedElementsInList(list);

  if (!currentItem) return visibleElements[visibleElements.length - 1];

  return getPreviousItemInArray(visibleElements, currentItem, {
    keyGetter: (item) => (getIsNotificationsGroup(item) ? item.id : item.id),
  });
}
