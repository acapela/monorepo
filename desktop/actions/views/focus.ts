import { createActionView } from "@aca/desktop/actions/action/view";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { animationStore } from "@aca/desktop/domains/embed/animationStore";
import { canListShowZenScreen } from "@aca/desktop/domains/list/all";
import { desktopRouter } from "@aca/desktop/routes";
import { focusSessionStore } from "@aca/desktop/store/focus";
import { uiStore } from "@aca/desktop/store/ui";

export const focusPageView = createActionView((context) => {
  const { session } = focusSessionStore;
  const isFocusRoute = desktopRouter.getIsRouteActive("focus");

  if (!session && !isFocusRoute) {
    return null;
  }

  const list = context.getTarget("list", true)!;
  const notification = context.getTarget("notification");

  if (!list) return null;

  function navigateToNotification(notification: NotificationEntity) {
    const groupThatNotificationBelongsTo = list.getNotificationGroup(notification);

    // When there's a single preview enabled, only one notification out of many is shown in focus
    // This check attempts to mark all of the notifications inside a single preview group as seen
    if (groupThatNotificationBelongsTo?.treatAsOneNotification) {
      groupThatNotificationBelongsTo.notifications.forEach((n) => n.markAsSeen());
    } else {
      notification.markAsSeen();
    }

    if (focusSessionStore.session) {
      focusSessionStore.session.activeNotification = notification;
    } else {
      desktopRouter.navigate("focus", { listId: list.id, notificationId: notification.id });
    }
  }

  const view = {
    list,
    notification,
    get nextNotification() {
      if (!notification) {
        return list.getAllNotifications().at(0) ?? null;
      }
      return list.getNextNotification(notification);
    },
    get prevNotification() {
      if (!notification) {
        return list.getAllNotifications().at(-1) ?? null;
      }
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
        if (canListShowZenScreen(view.list)) {
          uiStore.isDisplayingZenImage = true;
        }

        desktopRouter.navigate("list", { listId: list.id });
      }
    },
    goToPreviousNotification() {
      const { prevNotification } = view;

      if (!prevNotification) {
        return null;
      }

      animationStore.upcomingEmbedAnimation = "swipe-down";
      navigateToNotification(prevNotification);

      return prevNotification;
    },
    goToNextNotification() {
      const { nextNotification } = view;

      if (!nextNotification) {
        return view.goToPreviousNotification();
      }

      animationStore.upcomingEmbedAnimation = "swipe-up";
      navigateToNotification(nextNotification);

      return nextNotification;
    },
  };

  return view;
});
