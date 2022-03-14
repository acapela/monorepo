import React from "react";

import { requestPreviewFocus } from "@aca/desktop/bridge/preview";
import { assertGetActiveRouteParams, desktopRouter, getIsRouteActive } from "@aca/desktop/routes";
import { uiStore } from "@aca/desktop/store/ui";
import { IconArrowBottom, IconArrowLeft, IconArrowTop, IconKeyboard } from "@aca/ui/icons";

import { defineAction } from "./action";
import { ActionContext, ActionContextCallback } from "./action/context";
import { currentNotificationActionsGroup } from "./groups";
import { focusPageView } from "./views/focus";

export function isNotFocusingPreviewAnd(fn: ActionContextCallback<boolean>) {
  return (ctx: ActionContext) => !uiStore.isAnyPreviewFocused && fn(ctx);
}

export const exitFocusMode = defineAction({
  name: (ctx) => (ctx.isContextual ? "Exit" : "Go back to list"),
  group: currentNotificationActionsGroup,
  icon: <IconArrowLeft />,
  keywords: ["exit", "back"],
  shortcut: "Esc",
  canApply: isNotFocusingPreviewAnd(() => getIsRouteActive("focus")),
  handler(context) {
    const notification = context.view(focusPageView)?.notification;
    const { listId } = assertGetActiveRouteParams("focus");

    desktopRouter.navigate("list", { listId });

    if (notification) {
      uiStore.focusedTarget = notification;
    }
  },
});

export const focusOnNotificationPreview = defineAction({
  icon: <IconKeyboard />,
  group: currentNotificationActionsGroup,
  name: (ctx) => (ctx.isContextual ? "Focus" : "Focus on notification screen"),
  shortcut: ["Mod", "Enter"],
  canApply: isNotFocusingPreviewAnd(() => getIsRouteActive("focus")),

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
  canApply: isNotFocusingPreviewAnd((context) => !!context.view(focusPageView)?.nextNotification),
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
  canApply: isNotFocusingPreviewAnd((context) => !!context.view(focusPageView)?.prevNotification),
  handler(context) {
    const focusView = context.view(focusPageView);
    focusView?.goToPreviousNotification();
  },
});
