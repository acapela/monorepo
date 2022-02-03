import React from "react";

import { requestPreviewFocus } from "@aca/desktop/bridge/preview";
import { assertGetActiveRouteParams, desktopRouter, getIsRouteActive } from "@aca/desktop/routes";
import { uiStore } from "@aca/desktop/store/uiStore";
import { IconArrowBottom, IconArrowLeft, IconArrowTop, IconKeyboard } from "@aca/ui/icons";

import { defineAction } from "./action";
import { currentNotificationActionsGroup } from "./groups";
import { focusPageView } from "./views/focus";

export const exitFocusMode = defineAction({
  name: (ctx) => (ctx.isContextual ? "Exit" : "Go back to list"),
  group: currentNotificationActionsGroup,
  icon: <IconArrowLeft />,
  keywords: ["exit", "back"],
  shortcut: "Esc",
  canApply: () => getIsRouteActive("focus"),
  handler() {
    const { listId } = assertGetActiveRouteParams("focus");

    desktopRouter.navigate("list", { listId });
  },
});

export const focusOnNotificationPreview = defineAction({
  icon: <IconKeyboard />,
  group: currentNotificationActionsGroup,
  name: (ctx) => (ctx.isContextual ? "Focus" : "Focus on notification screen"),
  shortcut: ["Mod", "Enter"],
  canApply: () => {
    return getIsRouteActive("focus") && !uiStore.isAnyPreviewFocused;
  },
  handler(context) {
    const notification = context.assertTarget("notification");

    requestPreviewFocus({ url: notification.url });
  },
});

export const goToNextNotification = defineAction({
  icon: <IconArrowBottom />,
  group: currentNotificationActionsGroup,
  name: (ctx) => (ctx.isContextual ? "Next" : "Go to next notification"),
  shortcut: "ArrowDown",
  canApply: (context) => {
    return !!context.view(focusPageView)?.nextNotification;
  },
  handler(context) {
    const nextNotification = context.view(focusPageView)?.nextNotification;

    if (!nextNotification) return;

    desktopRouter.navigate("focus", {
      listId: context.assertTarget("list", true).id,
      notificationId: nextNotification.id,
    });
  },
});

export const goToPreviousNotification = defineAction({
  icon: <IconArrowTop />,
  group: currentNotificationActionsGroup,
  name: (ctx) => (ctx.isContextual ? "Previous" : "Go to previous notification"),
  shortcut: "ArrowUp",
  canApply: (context) => {
    return !!context.view(focusPageView)?.nextNotification;
  },
  handler(context) {
    const previousNotification = context.view(focusPageView)?.nextNotification;

    if (!previousNotification) return;

    desktopRouter.navigate("focus", {
      listId: context.assertTarget("list", true).id,
      notificationId: previousNotification.id,
    });
  },
});
