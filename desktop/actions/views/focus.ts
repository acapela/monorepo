import { createActionView } from "@aca/desktop/actions/action/view";
import { desktopRouter, getIsRouteActive } from "@aca/desktop/routes";
import { uiStore } from "@aca/desktop/store/uiStore";
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
    displayZenModeOrFocusNextItem() {
      const { list } = view;

      if (list.getAllNotifications().length > 0) {
        return view.goToNextNotification();
      }

      desktopRouter.navigate("list", { listId: list.id });
      uiStore.isDisplayingZenImage = true;
      return null;
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
