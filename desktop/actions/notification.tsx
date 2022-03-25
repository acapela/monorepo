import React from "react";

import { createAnalyticsEvent } from "@aca/desktop/analytics";
import { OpenAppUrl, openAppUrl } from "@aca/desktop/bridge/apps";
import { getIntegration } from "@aca/desktop/bridge/apps/shared";
import { requestPreviewPreload } from "@aca/desktop/bridge/preview";
import { getDb } from "@aca/desktop/clientdb";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { getIsNotificationsGroup } from "@aca/desktop/domains/group/group";
import { groupNotifications } from "@aca/desktop/domains/group/groupNotifications";
import { openedNotificationsGroupsStore } from "@aca/desktop/domains/group/openedStore";
import { PreviewLoadingPriority } from "@aca/desktop/domains/preview";
import { desktopRouter, getIsRouteActive } from "@aca/desktop/routes";
import { createCleanupObject } from "@aca/shared/cleanup";
import { pluralize } from "@aca/shared/text/pluralize";
import { IconCheck, IconCheckboxSquare, IconExternalLink, IconGlasses, IconLink1, IconTarget } from "@aca/ui/icons";

import { addToast } from "../domains/toasts/store";
import { defineAction } from "./action";
import { currentNotificationActionsGroup } from "./groups";
import { displayZenModeIfFinished, focusNextItemIfAvailable } from "./views/common";

async function convertToLocalAppUrlIfAny(notification: NotificationEntity): Promise<OpenAppUrl> {
  const notificationKind = notification.kind;
  const fallback = notification.url;

  // This corner cases shouldn't really ever appear
  if (!notificationKind) {
    return { fallback };
  }

  const urlConverter = getIntegration(notificationKind)?.convertToLocalAppUrl;

  if (urlConverter) {
    return await urlConverter(notification);
  } else {
    return { fallback };
  }
}

export const openNotificationInApp = defineAction({
  icon: <IconExternalLink />,
  group: currentNotificationActionsGroup,
  name: (ctx) => (ctx.isContextual ? "Open App" : "Open notification in app"),
  shortcut: ["O"],
  analyticsEvent: (ctx) => {
    const notification = ctx.getTarget("notification");

    const service_name = (notification?.kind && getIntegration(notification?.kind)?.name) ?? undefined;
    return createAnalyticsEvent("Notification Deeplink Opened", { service_name });
  },
  canApply: (ctx) => ctx.hasTarget("notification"),
  async handler(context) {
    const notification = context.assertTarget("notification");

    addToast({ message: `Opening notification in app...`, durationMs: 2000 });

    const url = await convertToLocalAppUrlIfAny(notification);

    await openAppUrl(url);
  },
});

export const copyNotificationLink = defineAction({
  icon: <IconLink1 />,
  group: currentNotificationActionsGroup,
  name: (ctx) => (ctx.isContextual ? "Copy link" : "Copy notification link"),
  shortcut: ["C"],
  keywords: ["url", "share"],
  canApply: (ctx) => ctx.hasTarget("notification") || ctx.hasTarget("group"),
  handler(context) {
    const notification = context.getTarget("notification");
    const group = context.getTarget("group");

    const url = notification?.url ?? group?.notifications.at(0)?.url ?? null;

    if (!url) return;

    window.electronBridge.copyToClipboard(url);

    addToast({ title: "Notification link copied", message: url });
  },
});

export const markNotificationUnread = defineAction({
  icon: <IconGlasses />,
  group: currentNotificationActionsGroup,
  name: (ctx) => (ctx.isContextual ? "Mark unread" : "Mark notification as unread"),
  shortcut: ["U"],
  keywords: ["snooze", "remind"],
  canApply: (ctx) => !!ctx.getTarget("notification")?.last_seen_at,
  handler(context) {
    const { undo } = context.assertTarget("notification").update({ last_seen_at: null });

    addToast({
      message: `Marked as unread`,
      action: {
        label: "Undo",
        callback() {
          undo();
        },
      },
    });
  },
});

export const markNotificationRead = defineAction({
  icon: <IconGlasses />,
  group: currentNotificationActionsGroup,
  name: (ctx) => (ctx.isContextual ? "Mark read" : "Mark notification as read"),
  shortcut: ["U"],
  keywords: ["seen", "done"],
  canApply: (ctx) => !ctx.getTarget("notification")?.last_seen_at,
  handler(context) {
    const { undo } = context.assertTarget("notification").update({ last_seen_at: new Date().toISOString() });

    addToast({
      message: `Marked as read`,
      action: {
        label: "Undo",
        callback() {
          undo();
        },
      },
    });
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
  analyticsEvent: (ctx) => {
    const notification = ctx.getTarget("notification");

    const notification_id = notification?.id;
    if (notification_id) {
      return createAnalyticsEvent("Notification Resolved", { notification_id });
    }
  },
  keywords: ["done", "next", "mark", "complete"],
  shortcut: ["E"],
  supplementaryLabel: (ctx) => ctx.getTarget("group")?.name ?? undefined,
  canApply: (ctx) => {
    return (
      (ctx.hasTarget("group") && ctx.getTarget("group")?.notifications.some((n) => !n.isResolved)) ||
      (ctx.hasTarget("notification") && !ctx.getTarget("notification")?.isResolved)
    );
  },
  handler(context) {
    const notification = context.getTarget("notification");
    let group = context.getTarget("group");

    const cancel = createCleanupObject();

    cancel.next = focusNextItemIfAvailable(context);

    if (!group && notification) {
      // If the given notification is part of a group which can be previewed through a single notification, we treat
      // marking one of them as done as marking the whole group as done
      group =
        groupNotifications(getDb().notification.query({ isResolved: false }).all)
          .filter(getIsNotificationsGroup)
          .find((group) => group.isOnePreviewEnough && group.notifications.some(({ id }) => notification.id === id)) ??
        null;
    }

    cancel.next = notification?.resolve()?.undo;

    group?.notifications.forEach((notification) => {
      cancel.next = notification.resolve()?.undo;
    });

    displayZenModeIfFinished(context);

    addToast({
      message: pluralize`${cancel.size} ${["notification"]} resolved`,
      action: {
        label: "Undo",
        callback() {
          cancel.clean("from-last");
        },
      },
    });
  },
});

export const unresolveNotification = defineAction({
  icon: <IconCheckboxSquare />,
  group: currentNotificationActionsGroup,
  name: "Undo resolve",
  shortcut: ["Shift", "E"],
  supplementaryLabel: (ctx) => ctx.getTarget("group")?.name ?? undefined,
  keywords: ["undo", "todo", "mark", "resolve", "revert"],
  canApply: (ctx) => {
    return (
      ctx.getTarget("notification")?.isResolved || !!ctx.getTarget("group")?.notifications.some((n) => n.isResolved)
    );
  },
  analyticsEvent: "Notification Unresolved",
  handler(context) {
    const notification = context.getTarget("notification");
    const group = context.getTarget("group");

    const cancel = createCleanupObject();

    cancel.next = focusNextItemIfAvailable(context);

    cancel.next = notification?.update({ resolved_at: null }).undo;

    group?.notifications.forEach((notification) => {
      cancel.next = notification.update({ resolved_at: null }).undo;
    });

    addToast({
      message: pluralize`${cancel.size} ${["notification"]} unresolved`,
      action: {
        label: "Undo",
        callback() {
          cancel.clean("from-last");
        },
      },
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

    if (group) {
      openedNotificationsGroupsStore.open(group.id);
      // When there's a single preview enabled, only one notification out of many is shown in focus
      // This check attempts to mark all of the notifications inside a single preview group as seen
      if (group.isOnePreviewEnough) {
        group.notifications.forEach((n) => n.markAsSeen());
      }
      const lastNotificationIndex = group.notifications.length - 1;
      const notificationToShow = group.isOnePreviewEnough
        ? group.notifications[lastNotificationIndex]
        : group.notifications[0];
      desktopRouter.navigate("focus", { listId: list.id, notificationId: notificationToShow.id });
      return;
    }

    if (notification) {
      notification.markAsSeen();
      desktopRouter.navigate("focus", { listId: list.id, notificationId: notification.id });
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
