import React from "react";

import { requestPreviewFocus, requestPreviewPreload } from "@aca/desktop/bridge/preview";
import {
  assertGetActiveRouteParams,
  desktopRouter,
  getIsRouteActive,
  getRouteParamsIfActive,
} from "@aca/desktop/routes";
import { uiStore } from "@aca/desktop/store/uiStore";
import { getNextItemInArray, getPreviousItemInArray } from "@aca/shared/array";
import { IconArrowBottom, IconArrowLeft, IconArrowTop, IconKeyboard, IconTarget } from "@aca/ui/icons";

import { getGroupedAndOrderedNotificationsInList } from "../domains/list/getNextItemInList";
import { defineAction } from "./action";
import { ActionContext } from "./action/context";
import { currentNotificationActionsGroup } from "./groups";

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

export function getNextNotificationInFocusMode(context: ActionContext) {
  const list = context.getTarget("list", true);
  const notification = context.getTarget("notification");

  if (!list || !notification) return null;

  const allNotifications = getGroupedAndOrderedNotificationsInList(list);

  return getNextItemInArray(allNotifications, notification, { loop: false });
}

export function getPrevNotificationInFocusMode(context: ActionContext) {
  const list = context.getTarget("list", true);
  const notification = context.getTarget("notification");

  if (!list || !notification) return null;

  const allNotifications = getGroupedAndOrderedNotificationsInList(list);

  return getPreviousItemInArray(allNotifications, notification, { loop: false });
}

export const goToNextNotification = defineAction({
  icon: <IconArrowBottom />,
  group: currentNotificationActionsGroup,
  name: (ctx) => (ctx.isContextual ? "Next" : "Go to next notification"),
  shortcut: "ArrowDown",
  canApply: (context) => {
    if (!getIsRouteActive("focus")) return false;

    const nextNotification = getNextNotificationInFocusMode(context);

    return !!nextNotification;
  },
  handler(context) {
    const nextNotification = getNextNotificationInFocusMode(context);

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
    if (!getIsRouteActive("focus")) return false;

    return !!getPrevNotificationInFocusMode(context);
  },
  handler(context) {
    const previousNotification = getPrevNotificationInFocusMode(context);

    if (!previousNotification) return;

    desktopRouter.navigate("focus", {
      listId: context.assertTarget("list", true).id,
      notificationId: previousNotification.id,
    });
  },
});
