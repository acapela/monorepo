import { createActionView } from "@aca/desktop/actions/action/view";
import { desktopRouter, getIsRouteActive } from "@aca/desktop/routes";
import { uiStore } from "@aca/desktop/store/ui";

export const focusPageView = createActionView((context) => {
  if (!getIsRouteActive("focus")) return null;

  const list = context.assertTarget("list", true);
  const notification = context.assertTarget("notification");

  const view = {
    list,
    notification,
    get nextNotification() {
      return list.getNextNotification(notification);
    },
    get prevNotification() {
      return list.getPreviousNotification(notification);
    },
    focusNextItemIfAvailable() {
      if (view.list.getAllNotifications().length > 0) {
        return view.goToNextNotification();
      }
    },
    displayZenModeIfFinished() {
      if (view.list.getAllNotifications().length == 0) {
        desktopRouter.navigate("list", { listId: list.id });
        uiStore.isDisplayingZenImage = true;
      }
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
