import React from "react";

import { requestPreviewFocus } from "@aca/desktop/bridge/preview";
import { openLinkRequest } from "@aca/desktop/bridge/system";
import { assertGetActiveRouteParams, desktopRouter, getIsRouteActive } from "@aca/desktop/routes";
import { uiStore } from "@aca/desktop/store/uiStore";
import { IconArrowBottom, IconArrowLeft, IconArrowTop, IconCheck, IconExternalLink, IconTarget } from "@aca/ui/icons";

import { defineAction } from "./action";

export const exitFocusMode = defineAction({
  name: "Exit focus mode",
  icon: <IconArrowLeft />,
  shortcut: "Esc",
  canApply: () => getIsRouteActive("focus"),
  handler() {
    const { listId } = assertGetActiveRouteParams("focus");

    desktopRouter.navigate("list", { listId });
  },
});

export const openFocusMode = defineAction({
  icon: <IconArrowBottom />,
  name: "Open focus mode for notification",
  shortcut: "Enter",
  canApply: (context) => {
    return !getIsRouteActive("focus") && context.hasTarget("list", true) && context.hasTarget("notification");
  },
  handler(context) {
    const list = context.assertTarget("list", true);
    const notification = context.assertTarget("notification");

    desktopRouter.navigate("focus", { listId: list.id, notificationId: notification.id });
  },
});

export const focusOnNotificationPreview = defineAction({
  icon: <IconTarget />,
  name: "Focus on notification screen",
  shortcut: ["Mod", "Enter"],
  canApply: () => {
    return getIsRouteActive("focus") && !uiStore.isAnyPreviewFocused;
  },
  handler(context) {
    const notification = context.assertTarget("notification");

    requestPreviewFocus({ url: notification.url });
  },
});

export const openNotificationInApp = defineAction({
  icon: <IconExternalLink />,
  name: "Open in original app",
  shortcut: ["Mod", "Shift", "O"],
  canApply: () => {
    return getIsRouteActive("focus");
  },
  handler(context) {
    const notification = context.assertTarget("notification");

    openLinkRequest({ url: notification.url });
  },
});

export const resolveNotification = defineAction({
  icon: <IconCheck />,
  name: "Resolve Notification",
  shortcut: ["Mod", "D"],
  canApply: () => {
    return getIsRouteActive("focus");
  },
  handler(context) {
    const notification = context.assertTarget("notification");

    notification.update({ resolved_at: new Date().toISOString() });
  },
});

export const goToNextNotification = defineAction({
  icon: <IconArrowBottom />,
  name: "Go to previous notification",
  shortcut: "ArrowDown",
  canApply: (context) => {
    if (!getIsRouteActive("focus")) return false;

    const list = context.assertTarget("list", true);
    const notification = context.assertTarget("notification");

    return !!list.getNextNotification(notification);
  },
  handler(context) {
    const list = context.assertTarget("list", true);
    const notification = context.assertTarget("notification");

    const nextNotification = list.getNextNotification(notification);

    if (!nextNotification) return;

    desktopRouter.navigate("focus", { listId: list.id, notificationId: nextNotification.id });
  },
});

export const goToPreviousNotification = defineAction({
  icon: <IconArrowTop />,
  name: "Go to previous notification",
  shortcut: "ArrowUp",
  canApply: (context) => {
    if (!getIsRouteActive("focus")) return false;

    const list = context.assertTarget("list", true);
    const notification = context.assertTarget("notification");

    return !!list.getPreviousNotification(notification);
  },
  handler(context) {
    const list = context.assertTarget("list", true);
    const notification = context.assertTarget("notification");

    const previousNotification = list.getPreviousNotification(notification);

    if (!previousNotification) return;

    desktopRouter.navigate("focus", { listId: list.id, notificationId: previousNotification.id });
  },
});
