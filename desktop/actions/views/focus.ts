import { cachedComputed } from "@aca/clientdb";
import { createActionView } from "@aca/desktop/actions/action/view";
import { orderNotificationsByGroups } from "@aca/desktop/domains/group/groupNotifications";
import { getIsRouteActive } from "@aca/desktop/routes";
import { getNextItemInArray, getPreviousItemInArray } from "@aca/shared/array";

export const focusPageView = createActionView((context) => {
  if (!getIsRouteActive("focus")) return null;

  const list = context.assertTarget("list", true);
  const notification = context.assertTarget("notification");

  // Let's cache grouping and ordering notifications
  const orderedNotifications = cachedComputed(() => orderNotificationsByGroups(list.getAllNotifications().all));

  return {
    list,
    notification,
    get nextNotification() {
      return getNextItemInArray(orderedNotifications(), notification);
    },
    get prevNotification() {
      return getPreviousItemInArray(orderedNotifications(), notification);
    },
  };
});
