import React from "react";

import { IconArrowBottom, IconArrowLeft, IconArrowTop } from "@aca/ui/icons";

import { assertGetActiveRouteParams, desktopRouter, getIsRouteActive } from "../routes";
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
