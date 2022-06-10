import { runInAction } from "mobx";

import { createCleanupObject } from "@aca/shared/cleanup";
import { MaybeCleanup } from "@aca/shared/types";

import { NotificationEntity } from "../clientdb/notification";
import { groupNotifications } from "../domains/group/groupNotifications";
import { ActionContext } from "./action/context";

function collectTargettedNotifications(ctx: ActionContext): Set<NotificationEntity> {
  const notifications = ctx.getTargets("notification");
  const groups = ctx.getTargets("group");

  const uniqueNotifications = new Set([...notifications, ...groups.map((g) => g.notifications).flat()]);

  const list = ctx.getTarget("list", true);

  /**
   * If more than one notification is selected - assume explicit selection and do not expand to all notifications in the same group
   */
  const isExplicitSelection = notifications.length > 1 || groups.length > 1;

  // If we're in list context and notifications are part of groups that are 'treatAsOne' - apply to all sibling notifications
  if (list && !isExplicitSelection) {
    for (const notification of notifications) {
      const group = list.getNotificationGroup(notification);

      if (!group || !group.treatAsOneNotification) continue;

      for (const groupNotification of group.notifications) {
        uniqueNotifications.add(groupNotification);
      }
    }
  }

  return uniqueNotifications;
}

/**
 * Will perform callback for each notification targetted by current context.
 *
 * Will also work - if multiple notifications or groups are targetted.
 *
 * Notes:
 * - if group is targetted - will pick all notifications from this group
 * - if notification is targetted and is member of 'treatAsOneNotification' group - all 'sibling' notifications will also be triggered
 */
export function runForEachTargettedNotification(
  ctx: ActionContext,
  callback: (notification: NotificationEntity) => MaybeCleanup
) {
  const uniqueNotifications = collectTargettedNotifications(ctx);

  const cleanup = createCleanupObject();

  runInAction(() => {
    for (const notification of uniqueNotifications) {
      cleanup.next = callback(notification);
    }
  });

  return {
    get operationsCount() {
      return groupNotifications(Array.from(uniqueNotifications)).length;
    },
    undo() {
      cleanup.clean("from-last");
    },
  };
}
