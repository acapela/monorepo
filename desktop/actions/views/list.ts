import { createActionView } from "@aca/desktop/actions/action/view";
import { getNotificationParentGroupInList } from "@aca/desktop/domains/group/findGroup";
import { getIsNotificationsGroup } from "@aca/desktop/domains/group/group";
import { NotificationOrGroup, groupNotifications } from "@aca/desktop/domains/group/groupNotifications";
import { openedNotificationsGroupsStore } from "@aca/desktop/domains/group/openedStore";
import { NotificationsList } from "@aca/desktop/domains/list/defineList";
import { getNextNotificationsList, getPreviousNotificationsList } from "@aca/desktop/domains/list/preconfigured";
import { getIsRouteActive } from "@aca/desktop/routes";
import { uiStore } from "@aca/desktop/store/uiStore";
import { getNextItemInArray, getPreviousItemInArray } from "@aca/shared/array";

export const listPageView = createActionView((context) => {
  if (!getIsRouteActive("list")) return null;

  const group = context.getTarget("group");
  const list = context.assertTarget("list", true);
  const notification = context.getTarget("notification");

  const view = {
    list,
    get focusedGroup() {
      if (group) return group;

      if (!notification || !list) return null;

      const targetGroup = getNotificationParentGroupInList(notification, list);

      return targetGroup;
    },
    get focusedNotification() {
      return notification;
    },
    get nextList() {
      return getNextNotificationsList(list);
    },
    get prevList() {
      return getPreviousNotificationsList(list);
    },
    get nextListItem() {
      return getNextVisibleItemInList(list, notification ?? group ?? undefined);
    },
    get prevListItem() {
      return getPreviousVisibleItemInList(list, notification ?? group ?? undefined);
    },
    displayZenModeOrFocusNextItem() {
      const { list } = view;

      if (list.getAllNotifications().hasItems) {
        return view.focusNextItem();
      }

      uiStore.isDisplayingZenImage = true;
      return null;
    },
    focusNextItem() {
      uiStore.focusedTarget = view.nextListItem;
    },
  };

  return view;
});

function getVisibleGroupedElementsInList(list: NotificationsList): NotificationOrGroup[] {
  const groupedList = groupNotifications(list.getAllNotifications());

  const result: NotificationOrGroup[] = [];

  groupedList.forEach((notificationOrGroup) => {
    result.push(notificationOrGroup);
    if (
      getIsNotificationsGroup(notificationOrGroup) &&
      !notificationOrGroup.isOnePreviewEnough &&
      openedNotificationsGroupsStore.getIsOpened(notificationOrGroup.id)
    ) {
      result.push(...notificationOrGroup.notifications);
    }
  });

  return result;
}

function getNextVisibleItemInList(list: NotificationsList, currentItem?: NotificationOrGroup) {
  const visibleElements = getVisibleGroupedElementsInList(list);

  if (!currentItem) return visibleElements[0];

  return getNextItemInArray(visibleElements, currentItem, {
    keyGetter: (item) => (getIsNotificationsGroup(item) ? item.id : item.id),
  });
}

function getPreviousVisibleItemInList(list: NotificationsList, currentItem?: NotificationOrGroup) {
  const visibleElements = getVisibleGroupedElementsInList(list);

  if (!currentItem) return visibleElements[visibleElements.length - 1];

  return getPreviousItemInArray(visibleElements, currentItem, {
    keyGetter: (item) => (getIsNotificationsGroup(item) ? item.id : item.id),
  });
}
