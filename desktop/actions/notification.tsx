import React from "react";

import { trackingEvent } from "@aca/desktop/analytics";
import { requestPreviewPreload } from "@aca/desktop/bridge/preview";
import { openLinkRequest } from "@aca/desktop/bridge/system";
import { getDb } from "@aca/desktop/clientdb";
import { getIsNotificationsGroup } from "@aca/desktop/domains/group/group";
import { groupNotifications } from "@aca/desktop/domains/group/groupNotifications";
import { openedNotificationsGroupsStore } from "@aca/desktop/domains/group/openedStore";
import { PreviewLoadingPriority } from "@aca/desktop/domains/preview";
import { desktopRouter, getIsRouteActive } from "@aca/desktop/routes";
import { IconCheck, IconCheckboxSquare, IconExternalLink, IconLink1, IconTarget } from "@aca/ui/icons";

import { getIntegration } from "../bridge/apps/shared";
import { NotificationEntity } from "../clientdb/notification";
import { defineAction } from "./action";
import { currentNotificationActionsGroup } from "./groups";
import { displayZenModeOrFocusNextItem } from "./views/common";

async function convertToLocalAppUrlIfAny(notification: NotificationEntity): Promise<string> {
  const notificationKind = notification.kind;
  const originalUrl = notification.url;

  // This corner cases shouldn't really ever appear
  if (!notificationKind) {
    return originalUrl;
  }

  const urlConverter = getIntegration(notificationKind)?.convertToLocalAppUrl;

  if (urlConverter) {
    return await urlConverter(originalUrl);
  } else {
    return originalUrl;
  }
}

export const openNotificationInApp = defineAction({
  icon: <IconExternalLink />,
  group: currentNotificationActionsGroup,
  name: (ctx) => (ctx.isContextual ? "Open App" : "Open notification in app"),
  shortcut: ["Mod", "O"],
  analyticsEvent: (ctx) => {
    const notification = ctx.getTarget("notification");

    const service_name = (notification?.kind && getIntegration(notification?.kind)?.name) ?? undefined;
    return trackingEvent("Notification Deeplink Opened", { service_name });
  },
  canApply: (ctx) => {
    return ctx.hasTarget("notification");
  },
  async handler(context) {
    const notification = context.assertTarget("notification");

    const url = await convertToLocalAppUrlIfAny(notification);

    openLinkRequest({ url });
  },
});

export const copyNotificationLink = defineAction({
  icon: <IconLink1 />,
  group: currentNotificationActionsGroup,
  name: (ctx) => (ctx.isContextual ? "Copy link" : "Copy notification link"),
  shortcut: ["Mod", "Shift", "C"],
  keywords: ["url", "share"],
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
  // Note: analytics happens directly in notification entity, as this action is quite complex and we modify many items at once.
  // Thus it seems easier to track directly in notif.resolve() handler
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
    let group = context.getTarget("group");

    if (!group && notification) {
      // If the given notification is part of a group which can be previewed through a single notification, we treat
      // marking one of them as done as marking the whole group as done
      group =
        groupNotifications(getDb().notification.query({ isResolved: false }).all)
          .filter(getIsNotificationsGroup)
          .find((group) => group.isOnePreviewEnough && group.notifications.some(({ id }) => notification.id === id)) ??
        null;
    }

    notification?.resolve();

    group?.notifications.forEach((notification) => {
      notification.resolve();
    });

    displayZenModeOrFocusNextItem(context);
  },
});

export const unresolveNotification = defineAction({
  icon: <IconCheckboxSquare />,
  group: currentNotificationActionsGroup,
  name: "Undo resolve",
  shortcut: ["Mod", "Shift", "D"],
  supplementaryLabel: (ctx) => ctx.getTarget("group")?.name ?? undefined,
  keywords: ["undo", "todo", "mark"],
  canApply: (ctx) => {
    return ctx.hasTarget("notification") || ctx.hasTarget("group");
  },
  handler(context) {
    const notification = context.getTarget("notification");
    const group = context.getTarget("group");

    displayZenModeOrFocusNextItem(context);

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
  canApply: ({ hasTarget }) => {
    if (getIsRouteActive("focus") || !hasTarget("list", true)) return false;
    if (!hasTarget("notification") && !hasTarget("group")) return false;

    return true;
  },
  handler(context) {
    const list = context.assertTarget("list", true);
    const notification = context.getTarget("notification");
    const group = context.getTarget("group");

    if (notification) {
      desktopRouter.navigate("focus", { listId: list.id, notificationId: notification.id });
      return;
    }

    if (group) {
      openedNotificationsGroupsStore.open(group.id);
      desktopRouter.navigate("focus", { listId: list.id, notificationId: group.notifications[0].id });
    }
  },
  onMightBeSelected(context) {
    const notification = context.getTarget("notification");

    if (notification) {
      return requestPreviewPreload({ url: notification.url, priority: PreviewLoadingPriority.next });
    }

    const group = context.getTarget("group");

    if (group) {
      requestPreviewPreload({ url: group.notifications[0].url, priority: PreviewLoadingPriority.next });
    }
  },
});
