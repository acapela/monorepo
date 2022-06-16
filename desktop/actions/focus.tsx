import React from "react";

import { requestForceReloadPreview, requestPreviewFocus } from "@aca/desktop/bridge/preview";
import { showMainWindowRequest } from "@aca/desktop/bridge/system";
import { animationStore } from "@aca/desktop/domains/embed/animationStore";
import { addToast } from "@aca/desktop/domains/toasts/store";
import { stopFocusSession } from "@aca/desktop/store/focus";
import { uiStore } from "@aca/desktop/store/ui";
import { IconArrowBottom, IconArrowLeft, IconArrowTop, IconKeyboard, IconRefreshCcw } from "@aca/ui/icons";

import { defineAction } from "./action";
import { currentNotificationActionsGroup } from "./groups";
import { focusPageView } from "./views/focus";

export const exitFocusMode = defineAction({
  name: (ctx) => (ctx.isContextual ? "Exit" : "Go back to list"),
  group: currentNotificationActionsGroup,
  icon: <IconArrowLeft />,
  keywords: ["exit", "back"],
  shortcut: "Esc",
  canApply: (ctx) => !!ctx.view(focusPageView),
  handler(context) {
    const notification = context.view(focusPageView)?.notification;

    stopFocusSession();

    if (notification) {
      uiStore.focusedTarget = notification;
    }

    showMainWindowRequest();
  },
});

export const refreshNotificationPreview = defineAction({
  name: (ctx) => (ctx.isContextual ? "Refresh" : "Refresh notification preview"),
  group: currentNotificationActionsGroup,
  icon: <IconRefreshCcw />,
  keywords: ["reload"],
  shortcut: ["Mod", "R"],
  canApply: (ctx) => !!ctx.view(focusPageView),
  async handler(context) {
    const notification = context.view(focusPageView)?.notification;

    if (!notification) return;

    await requestForceReloadPreview({ url: notification.url });

    addToast({
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
  canApply: (ctx) => !!ctx.view(focusPageView),

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
  canApply: (context) => !!context.view(focusPageView)?.nextNotification && !animationStore.isAnimating,
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
  canApply: (context) => !!context.view(focusPageView)?.prevNotification && !animationStore.isAnimating,
  handler(context) {
    const focusView = context.view(focusPageView);
    focusView?.goToPreviousNotification();
  },
});
