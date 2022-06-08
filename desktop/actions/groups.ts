import { getNotificationsGroupMeta } from "../domains/group/group";
import { getNotificationMeta } from "../domains/notification/meta";
import { ActionData } from "./action";
import { defineGroup } from "./action/group";
import { appActionsGroup } from "./app";
import { accountActionsGroup } from "./auth";
import { devActionsGroup } from "./dev";
import { currentListActionsGroup } from "./lists";
import { navigationActionsGroup } from "./navigation";
import { settingsActionsGroup } from "./settings";

export const searchNotificationsGroup = defineGroup({
  name: "Search - Notifications",
});

export const searchListActionsGroup = defineGroup({
  name: "Search - List",
});

export const currentNotificationActionsGroup = defineGroup({
  name: (ctx) => {
    const notification = ctx.getTarget("notification");

    if (notification) return `Notification - ${getNotificationMeta(notification).title}`;

    const group = ctx.getTarget("group");

    if (group) return `${getNotificationsGroupMeta(group).title}`;

    return "Notification";
  },
});

export const isNotificationAction = (action: ActionData) => action.group === currentNotificationActionsGroup;

export const groupsPriority = [
  currentListActionsGroup,
  currentListActionsGroup,

  searchListActionsGroup,
  searchNotificationsGroup,

  settingsActionsGroup,

  navigationActionsGroup,
  appActionsGroup,
  accountActionsGroup,
  devActionsGroup,
];
