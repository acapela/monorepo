import React from "react";

import { requestPreviewFocus, requestPreviewPreload } from "@aca/desktop/bridge/preview";
import { openLinkRequest } from "@aca/desktop/bridge/system";
import {
  assertGetActiveRouteParams,
  desktopRouter,
  getIsRouteActive,
  getRouteParamsIfActive,
} from "@aca/desktop/routes";
import { uiStore } from "@aca/desktop/store/uiStore";
import {
  IconArrowBottom,
  IconArrowLeft,
  IconArrowTop,
  IconCheck,
  IconExternalLink,
  IconKeyboard,
  IconLink1,
  IconTarget,
} from "@aca/ui/icons";

import { getNotificationTitle } from "../domains/notification/title";
import { defineAction } from "./action";
import { ActionContext } from "./action/context";
import { defineGroup } from "./action/group";

export const currentNotificationActionsGroup = defineGroup({
  name: (ctx) => {
    const notification = ctx.getTarget("notification");

    if (notification) return `Notification - ${getNotificationTitle(notification)}`;

    return "Notification";
  },
});

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

export const openFocusMode = defineAction({
  icon: <IconTarget />,
  group: currentNotificationActionsGroup,
  name: (ctx) => (ctx.isContextual ? "Open" : "Open notification"),
  shortcut: "Enter",
  canApply: (context) => {
    const activeNotificationId = getRouteParamsIfActive("focus")?.notificationId;
    const targetNotification = context.getTarget("notification");

    if (!targetNotification) return false;

    if (targetNotification.id === activeNotificationId) return false;

    return context.hasTarget("list", true);
  },
  handler(context) {
    const list = context.assertTarget("list", true);
    const notification = context.assertTarget("notification");

    desktopRouter.navigate("focus", { listId: list.id, notificationId: notification.id });
  },
  onMightBeSelected(context) {
    const notification = context.assertTarget("notification");

    return requestPreviewPreload({ url: notification.url });
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

export const openNotificationInApp = defineAction({
  icon: <IconExternalLink />,
  group: currentNotificationActionsGroup,
  name: (ctx) => (ctx.isContextual ? "Open App" : "Open notification in app"),
  shortcut: ["Mod", "O"],
  canApply: (ctx) => {
    return ctx.hasTarget("notification");
  },
  handler(context) {
    const notification = context.assertTarget("notification");

    openLinkRequest({ url: notification.url });
  },
});

export const copyNotificationLink = defineAction({
  icon: <IconLink1 />,
  group: currentNotificationActionsGroup,
  name: (ctx) => (ctx.isContextual ? "Copy link" : "Copy notification link"),
  shortcut: ["Mod", "Shift", "C"],
  canApply: (ctx) => {
    return ctx.hasTarget("notification");
  },
  handler(context) {
    const notification = context.assertTarget("notification");

    window.electronBridge.copyToClipboard(notification.url);
  },
});

function getNextNotification(context: ActionContext) {
  const list = context.assertTarget("list", true);
  const notification = context.assertTarget("notification");

  return {
    listId: list?.id,
    nextNotification: list?.getNextNotification(notification),
  } as const;
}

export const resolveNotification = defineAction({
  icon: <IconCheck />,
  group: currentNotificationActionsGroup,
  name: (ctx) => (ctx.isContextual ? "Resolve" : "Resolve Notification"),
  keywords: ["done", "next", "mark"],
  shortcut: ["Mod", "D"],
  canApply: (ctx) => {
    return ctx.hasTarget("notification");
  },
  handler(context) {
    const notification = context.assertTarget("notification");
    const { listId, nextNotification } = getNextNotification(context);

    notification.update({ resolved_at: new Date().toISOString() });

    if (!getIsRouteActive("focus")) {
      return;
    }
    if (nextNotification) {
      desktopRouter.navigate("focus", { listId, notificationId: nextNotification.id });
    } else {
      desktopRouter.navigate("list", { listId });
    }
  },
});

export const goToNextNotification = defineAction({
  icon: <IconArrowBottom />,
  group: currentNotificationActionsGroup,
  name: (ctx) => (ctx.isContextual ? "Next" : "Go to next notification"),
  shortcut: "ArrowDown",
  canApply: (context) => {
    if (!getIsRouteActive("focus")) return false;

    const { listId, nextNotification } = getNextNotification(context);

    return !!listId && !!nextNotification;
  },
  handler(context) {
    const { listId, nextNotification } = getNextNotification(context);

    if (!nextNotification) return;

    desktopRouter.navigate("focus", { listId, notificationId: nextNotification.id });
  },
});

export const goToPreviousNotification = defineAction({
  icon: <IconArrowTop />,
  group: currentNotificationActionsGroup,
  name: (ctx) => (ctx.isContextual ? "Previous" : "Go to previous notification"),
  shortcut: "ArrowUp",
  canApply: (context) => {
    if (!getIsRouteActive("focus")) return false;

    const list = context.getTarget("list", true);
    const notification = context.getTarget("notification");

    return !!notification && !!list?.getPreviousNotification(notification);
  },
  handler(context) {
    const list = context.assertTarget("list", true);
    const notification = context.assertTarget("notification");

    const previousNotification = list.getPreviousNotification(notification);

    if (!previousNotification) return;

    desktopRouter.navigate("focus", { listId: list.id, notificationId: previousNotification.id });
  },
});
