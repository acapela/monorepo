import React from "react";

import { requestForceReloadPreview, requestPreviewFocus } from "@aca/desktop/bridge/preview";
import { assertGetActiveRouteParams, desktopRouter, getIsRouteActive } from "@aca/desktop/routes";
import { uiStore } from "@aca/desktop/store/ui";
import { IconArrowBottom, IconArrowLeft, IconArrowTop, IconKeyboard, IconRefreshCcw } from "@aca/ui/icons";

import { addToast } from "../domains/toasts/store";
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
  handler(context) {
    const notification = context.view(focusPageView)?.notification;
    const { listId } = assertGetActiveRouteParams("focus");

    desktopRouter.navigate("list", { listId });

    if (notification) {
      uiStore.focusedTarget = notification;
    }
  },
});

export const refreshNotificationPreview = defineAction({
  name: (ctx) => (ctx.isContextual ? "Refresh" : "Refresh notification preview"),
  group: currentNotificationActionsGroup,
  icon: <IconRefreshCcw />,
  keywords: ["reload"],
  shortcut: ["Mod", "R"],
  canApply: () => getIsRouteActive("focus"),
  async handler(context) {
    const notification = context.view(focusPageView)?.notification;

    if (!notification) return;

    await requestForceReloadPreview({ url: notification.url });

    addToast({
      title: "Notification",
      message: `Refreshing notification preview...`,
      durationMs: 2000,
    });
  },
});

export const focusOnNotificationPreview = defineAction({
  icon: <IconKeyboard />,
  group: currentNotificationActionsGroup,
  name: (ctx) => (ctx.isContextual ? "Focus" : "Focus on notification screen"),
  shortcut: ["Mod", "Enter"],
  canApply: () => getIsRouteActive("focus"),

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
  canApply: (context) => !!context.view(focusPageView)?.nextNotification,
  handler(context) {
    const focusView = context.view(focusPageView);
    focusView?.goToNextNotification();
  },
});

export const goToPreviousNotification = defineAction({
  icon: <IconArrowTop />,
  group: currentNotificationActionsGroup,
  name: (ctx) => (ctx.isContextual ? "Previous" : "Go to previous notification"),
  shortcut: "ArrowUp",
  canApply: (context) => !!context.view(focusPageView)?.prevNotification,
  handler(context) {
    const focusView = context.view(focusPageView);
    focusView?.goToPreviousNotification();
  },
});
