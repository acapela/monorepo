import React from "react";

import { openLinkRequest } from "@aca/desktop/bridge/system";
import { desktopRouter, getRouteParamsIfActive } from "@aca/desktop/routes";
import { IconCheck, IconCheckboxSquare, IconExternalLink, IconLink1, IconTarget } from "@aca/ui/icons";

import { requestPreviewPreload } from "../bridge/preview";
import { defineAction } from "./action";
import { currentNotificationActionsGroup } from "./groups";
import { goToOrFocusNextItem } from "./views/common";

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
  name: (ctx) => {
    if (ctx.hasTarget("group")) {
      return ctx.isContextual ? "Resolve all" : "Resolve all notifications in group";
    }

    return ctx.isContextual ? "Resolve" : "Resolve Notification";
  },
  keywords: ["done", "next", "mark"],
  shortcut: ["Mod", "D"],
  supplementaryLabel: (ctx) => ctx.getTarget("group")?.name ?? undefined,
  canApply: (ctx) => {
    const notification = ctx.getTarget("notification");

    if (notification) {
      return !notification.isResolved;
    }

    const group = ctx.getTarget("group");

    if (group) {
      return group.notifications.some((notification) => !notification.isResolved);
    }

    return false;
  },
  handler(context) {
    const notification = context.getTarget("notification");
    const group = context.getTarget("group");

    goToOrFocusNextItem(context);

    notification?.resolve();

    group?.notifications.forEach((notification) => {
      notification.resolve();
    });
  },
});

export const unresolveNotification = defineAction({
  icon: <IconCheckboxSquare />,
  group: currentNotificationActionsGroup,
  name: "Undo resolve",
  supplementaryLabel: (ctx) => ctx.getTarget("group")?.name ?? undefined,
  keywords: ["undo", "todo", "mark"],
  canApply: (ctx) => {
    return ctx.hasTarget("notification") || ctx.hasTarget("group");
  },
  handler(context) {
    const notification = context.getTarget("notification");
    const group = context.getTarget("group");

    goToOrFocusNextItem(context);

    notification?.update({ resolved_at: null });
    group?.notifications.forEach((notification) => {
      notification.update({ resolved_at: null });
    });
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
