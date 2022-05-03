import { defer } from "lodash";
import React from "react";

import { focusPageView } from "@aca/desktop/actions/views/focus";
import { createAnalyticsEvent } from "@aca/desktop/analytics";
import { OpenAppUrl, openAppUrl } from "@aca/desktop/bridge/apps";
import { getIntegration } from "@aca/desktop/bridge/apps/shared";
import { requestEmbedPreload } from "@aca/desktop/bridge/preview";
import { getDb } from "@aca/desktop/clientdb";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { PreviewLoadingPriority } from "@aca/desktop/domains/embed";
import { getIsNotificationsGroup } from "@aca/desktop/domains/group/group";
import { groupNotifications } from "@aca/desktop/domains/group/groupNotifications";
import { openedNotificationsGroupsStore } from "@aca/desktop/domains/group/openedStore";
import { desktopRouter, getIsRouteActive } from "@aca/desktop/routes";
import { createCleanupObject } from "@aca/shared/cleanup";
import { pluralize } from "@aca/shared/text/pluralize";
import {
  IconCheck,
  IconCheckboxSquare,
  IconClock,
  IconClockCross,
  IconExternalLink,
  IconGlasses,
  IconLink1,
  IconTarget,
} from "@aca/ui/icons";

import { addToast } from "../domains/toasts/store";
import { defineAction } from "./action";
import { currentNotificationActionsGroup } from "./groups";
import { canApplySnooze, getSnoozeSuggestionActions } from "./snooze";
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

export const resolveNotification = defineAction({
  icon: <IconCheck />,
  group: currentNotificationActionsGroup,
  name: (ctx) => {
    if (ctx.hasTarget("group")) {
      return ctx.isContextual ? "Resolve group" : "Resolve all notifications in group";
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
      // This is the primary action for moving through lists in focus mode, we do not want to block this behavior
      // just because a notification is already resolved.
      ctx.hasView(focusPageView) ||
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
        groupNotifications(getDb().notification.find({ isResolved: false }))
          .filter(getIsNotificationsGroup)
          .find((group) => group.isOnePreviewEnough && group.notifications.some(({ id }) => notification.id === id)) ??
        null;
    }

    cancel.next = notification?.resolve()?.undo;

    group?.notifications.forEach((notification) => {
      cancel.next = notification.resolve()?.undo;
    });

    // Waiting for lists to get updated
    defer(() => {
      displayZenModeIfFinished(context);
    });

    addToast({
      message: pluralize`${group ? group.notifications.length : 1} ${["notification"]} resolved`,
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
      message: pluralize`${group ? group.notifications.length : 1} ${["notification"]} unresolved`,
      action: {
        label: "Undo",
        callback() {
          cancel.clean("from-last");
        },
      },
    });
  },
});

export const snoozeNotification = defineAction({
  group: currentNotificationActionsGroup,
  name: (ctx) => {
    if (ctx.hasTarget("group")) {
      return ctx.isContextual ? "Snooze all" : "Snooze group...";
    }

    return ctx.isContextual ? "Snooze" : "Snooze notification...";
  },
  supplementaryLabel: (ctx) => ctx.getTarget("group")?.name ?? undefined,
  analyticsEvent: (ctx) => {
    const notification = ctx.getTarget("notification");

    const notification_id = notification?.id;
    if (notification_id) {
      return createAnalyticsEvent("Notification Resolved", { notification_id });
    }
  },
  keywords: ["delay", "time"],
  canApply: canApplySnooze,
  icon: <IconClock />,
  shortcut: ["H"],
  handler() {
    return {
      searchPlaceholder: "In 3 days...",
      isContextual: true,
      getActions: (context) => {
        return getSnoozeSuggestionActions(context);
      },
    };
  },
});

export const unsnoozeNotification = defineAction({
  group: currentNotificationActionsGroup,
  name: "Cancel snooze",
  supplementaryLabel: (ctx) => ctx.getTarget("group")?.name ?? undefined,
  keywords: ["now", "remove", "schedule", "do", "unsnooze", "undo"],
  canApply: (ctx) => {
    if (ctx.getTarget("notification")?.isSnoozed === true) return true;
    if (ctx.getTarget("group")?.notifications.some((n) => n.isSnoozed) === true) return true;

    return false;
  },
  icon: <IconClockCross />,
  shortcut: ["Mod", "W"],
  handler(ctx) {
    const cancel = createCleanupObject("from-last");

    cancel.next = ctx.getTarget("notification")?.update({ snoozed_until: null }).undo;
    ctx.getTarget("group")?.notifications.forEach((notification) => {
      cancel.next = notification.update({ snoozed_until: null }).undo;
    });

    addToast({
      message: pluralize`${cancel.size} ${["notification"]} unsnoozed`,
      action: {
        label: "Undo",
        callback() {
          cancel.clean();
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
      const notificationToShow = group.notifications[0];
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
      return requestEmbedPreload({ url: notification.url, priority: PreviewLoadingPriority.next });
    }

    const group = context.getTarget("group");

    if (group) {
      requestEmbedPreload({ url: group.notifications[0].url, priority: PreviewLoadingPriority.next });
    }
  },
});

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
  canApply: (ctx) => {
    const notification = ctx.getTarget("notification");
    if (!notification) {
      return false;
    }
    return !notification.last_seen_at;
  },
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
