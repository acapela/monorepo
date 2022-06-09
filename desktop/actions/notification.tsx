import { defer } from "lodash";
import React from "react";

import { focusPageView } from "@aca/desktop/actions/views/focus";
import { createAnalyticsEvent } from "@aca/desktop/analytics";
import { OpenAppUrl, openAppUrl } from "@aca/desktop/bridge/apps";
import { getIntegration } from "@aca/desktop/bridge/apps/shared";
import { requestEmbedPreload } from "@aca/desktop/bridge/preview";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { PreviewLoadingPriority } from "@aca/desktop/domains/embed";
import { openedNotificationsGroupsStore } from "@aca/desktop/domains/group/openedStore";
import { desktopRouter } from "@aca/desktop/routes";
import { createCleanupObject } from "@aca/shared/cleanup";
import { pluralize } from "@aca/shared/text/pluralize";
import {
  IconBell,
  IconBellSlash,
  IconBookmarkPlus,
  IconBookmarkSlash,
  IconCheck,
  IconExternalLink,
  IconGlasses,
  IconLink1,
  IconTarget,
  IconUndo,
} from "@aca/ui/icons";

import { getNotificationTitle } from "../domains/notification/title";
import { addToast } from "../domains/toasts/store";
import { defineAction } from "./action";
import { ActionContext } from "./action/context";
import { currentNotificationActionsGroup } from "./groups";
import { getReminderSuggestionActions } from "./reminders";
import { runForEachTargettedNotification } from "./utils";
import { displayZenModeIfFinished, focusNextItemIfAvailable } from "./views/common";

function getContextHasNotificationMatching(
  ctx: ActionContext,
  matcher?: (notification: NotificationEntity) => boolean
) {
  const notification = ctx.getTarget("notification");

  if (notification) {
    if (!matcher) return true;
    return matcher(notification);
  }

  const group = ctx.getTarget("group");

  if (group) {
    if (!matcher) return true;
    return group.notifications.some((notification) => matcher(notification));
  }

  return false;
}

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
  supplementaryLabel: (ctx) => ctx.getTarget("group")?.getMeta().title ?? undefined,
  canApply: (ctx) => {
    return (
      // This is the primary action for moving through lists in focus mode, we do not want to block this behavior
      // just because a notification is already resolved.
      ctx.hasView(focusPageView) || getContextHasNotificationMatching(ctx, (n) => !n.isResolved)
    );
  },
  handler(context) {
    const cancel = createCleanupObject();

    cancel.next = focusNextItemIfAvailable(context);

    const { operationsCount, undo: undoResolved } = runForEachTargettedNotification(context, (notification) => {
      return notification.resolve()?.undo;
    });

    cancel.next = undoResolved;

    // Waiting for lists to get updated
    defer(() => {
      displayZenModeIfFinished(context);
    });

    addToast({
      message: pluralize`${operationsCount} ${["notification"]} resolved`,
      action: {
        label: "Undo",
        callback() {
          cancel.clean("from-last");
        },
      },
    });
  },
});

export const saveNotification = defineAction({
  icon: <IconBookmarkPlus />,
  group: currentNotificationActionsGroup,
  name: `Move to "Saved"`,
  analyticsEvent: (ctx) => {
    const notification = ctx.getTarget("notification");

    const notification_id = notification?.id;
    if (notification_id) {
      return createAnalyticsEvent("Notification Saved", { notification_id });
    }
  },
  keywords: ["flag"],
  shortcut: ["S"],
  supplementaryLabel: (ctx) => ctx.getTarget("group")?.getMeta().title ?? undefined,
  canApply: (ctx) => {
    return getContextHasNotificationMatching(ctx, (n) => !n.isSaved);
  },
  handler(context) {
    const { operationsCount, undo } = runForEachTargettedNotification(context, (notification) => {
      return notification.markAsSaved().undo;
    });

    // Waiting for lists to get updated
    defer(() => {
      displayZenModeIfFinished(context);
    });

    addToast({
      message: pluralize`${operationsCount} ${["notification"]} saved`,
      action: {
        label: "Undo",
        callback() {
          undo();
        },
      },
    });
  },
});

export const cancelSaveNotification = defineAction({
  icon: <IconBookmarkSlash />,
  group: currentNotificationActionsGroup,
  name: `Remove from "Saved"`,
  shortcut: ["Shift", "S"],
  supplementaryLabel: (ctx) => ctx.getTarget("group")?.getMeta().title ?? undefined,
  keywords: ["undo", "flag"],
  canApply: (ctx) => {
    return getContextHasNotificationMatching(ctx, (n) => n.isSaved);
  },
  analyticsEvent: (ctx) => {
    const notification = ctx.getTarget("notification");

    const notification_id = notification?.id;
    if (notification_id) {
      return createAnalyticsEvent("Notification Unsaved", { notification_id });
    }
  },
  handler(context) {
    const cancel = createCleanupObject();
    cancel.next = focusNextItemIfAvailable(context);
    const { operationsCount, undo } = runForEachTargettedNotification(context, (notification) => {
      return notification.update({ saved_at: null }).undo;
    });

    cancel.next = undo;

    addToast({
      message: pluralize`Cancelled save for ${operationsCount} ${["notification"]}`,
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
  icon: <IconUndo />,
  group: currentNotificationActionsGroup,
  name: "Undo resolve",
  shortcut: ["Shift", "E"],
  supplementaryLabel: (ctx) => ctx.getTarget("group")?.getMeta().title ?? undefined,
  keywords: ["undo", "todo", "mark", "resolve", "revert"],
  canApply: (ctx) => {
    return getContextHasNotificationMatching(ctx, (n) => n.isResolved);
  },
  analyticsEvent: (ctx) => {
    const notification = ctx.getTarget("notification");

    const notification_id = notification?.id;
    if (notification_id) {
      return createAnalyticsEvent("Notification Unresolved", { notification_id });
    }
  },
  handler(context) {
    const cancel = createCleanupObject();

    cancel.next = focusNextItemIfAvailable(context);

    const { operationsCount, undo } = runForEachTargettedNotification(context, (notification) => {
      return notification.update({ resolved_at: null }).undo;
    });

    cancel.next = undo;

    addToast({
      message: pluralize`${operationsCount} ${["notification"]} unresolved`,
      action: {
        label: "Undo",
        callback() {
          cancel.clean("from-last");
        },
      },
    });
  },
});

export const addReminderToNotification = defineAction({
  group: currentNotificationActionsGroup,
  name: "Add reminder",
  supplementaryLabel: (ctx) => ctx.getTarget("group")?.getMeta().title ?? undefined,
  analyticsEvent: (ctx) => {
    const notification = ctx.getTarget("notification");

    const notification_id = notification?.id;
    if (notification_id) {
      return createAnalyticsEvent("Notification Resolved", { notification_id });
    }
  },
  keywords: ["delay", "time"],
  canApply: (ctx) => getContextHasNotificationMatching(ctx, (n) => !n.hasReminder),
  icon: <IconBell />,
  shortcut: ["H"],
  handler() {
    return {
      searchPlaceholder: "In 3 days...",
      isContextual: true,
      getActions: (context) => {
        return getReminderSuggestionActions(context);
      },
    };
  },
});

export const removeNotificationReminder = defineAction({
  group: currentNotificationActionsGroup,
  name: "Remove reminder",
  supplementaryLabel: (ctx) => ctx.getTarget("group")?.getMeta().title ?? undefined,
  keywords: ["now", "remove", "schedule", "do", "cancel", "undo"],
  canApply: (ctx) => {
    return getContextHasNotificationMatching(ctx, (n) => n.hasReminder);
  },
  icon: <IconBellSlash />,
  shortcut: ["Mod", "W"],
  handler(ctx) {
    const { operationsCount, undo } = runForEachTargettedNotification(ctx, (notification) => {
      return notification.update({ snoozed_until: null }).undo;
    });

    addToast({
      message: pluralize`Removed reminder for ${operationsCount} ${["notification"]}`,
      action: {
        label: "Undo",
        callback() {
          undo();
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
    if (desktopRouter.getIsRouteActive("focus") || !hasTarget("list", true)) return false;
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
      if (group.treatAsOneNotification) {
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

    addToast({
      title: `Opening notification in app...`,
      message: getNotificationTitle(notification),
      durationMs: 2000,
    });

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
  keywords: ["remind"],
  canApply: (ctx) => !!ctx.getTarget("notification")?.last_seen_at,
  handler(context) {
    const notification = context.assertTarget("notification");
    const { undo } = notification.update({ last_seen_at: null });

    addToast({
      title: `Marked as unread`,
      message: getNotificationTitle(notification),
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
    const notification = context.assertTarget("notification");
    const { undo } = notification.update({ last_seen_at: new Date().toISOString() });

    addToast({
      title: `Marked as read`,
      message: getNotificationTitle(notification),
      action: {
        label: "Undo",
        callback() {
          undo();
        },
      },
    });
  },
});
