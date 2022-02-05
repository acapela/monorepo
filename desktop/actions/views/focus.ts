import { cachedComputed } from "@aca/clientdb";
import { createActionView } from "@aca/desktop/actions/action/view";
import { orderNotificationsByGroups } from "@aca/desktop/domains/group/groupNotifications";
import { desktopRouter, getIsRouteActive } from "@aca/desktop/routes";
import { getNextItemInArray, getPreviousItemInArray } from "@aca/shared/array";

export const focusPageView = createActionView((context) => {
  if (!getIsRouteActive("focus")) return null;

  const list = context.assertTarget("list", true);
  const notification = context.assertTarget("notification");

  // Let's cache grouping and ordering notifications
  const orderedNotifications = list.getAllNotifications;

  const view = {
    list,
    notification,
    get nextNotification() {
      return getNextItemInArray(orderedNotifications(), notification);
    },
    get prevNotification() {
      return getPreviousItemInArray(orderedNotifications(), notification);
    },
    goToNextNotification() {
      const { nextNotification } = view;
      if (!nextNotification) {
        desktopRouter.navigate("list", { listId: list.id });
        return null;
      }

      desktopRouter.navigate("focus", { listId: list.id, notificationId: nextNotification.id });

      return nextNotification;
    },
  };

  return view;
});
