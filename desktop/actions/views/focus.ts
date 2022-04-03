import { createActionView } from "@aca/desktop/actions/action/view";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { canListShowZenScreen } from "@aca/desktop/domains/list/all";
import { desktopRouter, getIsRouteActive } from "@aca/desktop/routes";
import { uiStore } from "@aca/desktop/store/ui";

export const focusPageView = createActionView((context) => {
  if (!getIsRouteActive("focus")) return null;

  const list = context.assertTarget("list", true);
  const notification = context.assertTarget("notification");

  function navigateToNotification(notification: NotificationEntity) {
    const groupThatNotificationBelongsTo = list.getNotificationGroup(notification);

    // When there's a single preview enabled, only one notification out of many is shown in focus
    // This check attempts to mark all of the notifications inside a single preview group as seen
    if (groupThatNotificationBelongsTo?.isOnePreviewEnough) {
      groupThatNotificationBelongsTo.notifications.forEach((n) => n.markAsSeen());
    } else {
      notification.markAsSeen();
    }

    desktopRouter.navigate("focus", { listId: list.id, notificationId: notification.id });
  }

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
    focusPrevItemIfAvailable() {
      if (view.list.getAllNotifications().length > 0) {
        return view.goToPreviousNotification();
      }
    },
    displayZenModeIfFinished() {
      if (view.list.getAllNotifications().length == 0) {
        desktopRouter.navigate("list", { listId: list.id });
        if (canListShowZenScreen(view.list)) {
          uiStore.isDisplayingZenImage = true;
        }
      }
    },
    goToPreviousNotification() {
      const { prevNotification } = view;

      if (!prevNotification) {
        desktopRouter.navigate("list", { listId: list.id });
        return null;
      }

      navigateToNotification(prevNotification);

      return prevNotification;
    },
    goToNextNotification() {
      const { nextNotification } = view;

      if (!nextNotification) {
        return view.goToPreviousNotification();
      }

      navigateToNotification(nextNotification);

      return nextNotification;
    },
  };

  return view;
});
