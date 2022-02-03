import React from "react";

import { openLinkRequest } from "@aca/desktop/bridge/system";
import { desktopRouter, getIsRouteActive } from "@aca/desktop/routes";
import { uiStore } from "@aca/desktop/store/uiStore";
import { IconCheck, IconExternalLink, IconLink1 } from "@aca/ui/icons";

import { defineAction } from "./action";
import { getNextNotificationInFocusMode } from "./focus";
import { currentNotificationActionsGroup } from "./groups";
import { getNextVisibleItemInListMode } from "./lists";

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

export const resolveNotification = defineAction({
  icon: <IconCheck />,
  group: currentNotificationActionsGroup,
  name: (ctx) => (ctx.isContextual ? "Resolve" : "Resolve Notification"),
  keywords: ["done", "next", "mark"],
  shortcut: ["Mod", "D"],
  canApply: (ctx) => {
    const notification = ctx.getTarget("notification");

    if (notification) return !notification.isResolved;

    const group = ctx.getTarget("group");

    if (group) return group.notifications.some((notification) => !notification.isResolved);

    return false;
  },
  handler(context) {
    const list = context.assertTarget("list", true);
    const notification = context.assertTarget("notification");
    if (getIsRouteActive("focus")) {
      const nextNotification = getNextNotificationInFocusMode(context);

      if (nextNotification) {
        desktopRouter.navigate("focus", { listId: list.id, notificationId: nextNotification.id });
      } else {
        desktopRouter.navigate("list", { listId: list.id });
      }

      notification.resolve();

      return;
    }

    if (getIsRouteActive("list")) {
      const nextVisibleItem = getNextVisibleItemInListMode(context);

      notification.resolve();

      if (!nextVisibleItem) return;

      uiStore.focusedTarget = nextVisibleItem;
    }
  },
});
