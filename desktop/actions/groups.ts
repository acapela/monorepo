import { getNotificationTitle } from "../domains/notification/title";
import { defineGroup } from "./action/group";
import { appActionsGroup } from "./app";
import { accountActionsGroup } from "./auth";
import { devActionsGroup } from "./dev";
import { currentListActionsGroup } from "./lists";
import { navigationActionsGroup } from "./navigation";

export const searchNotificationsGroup = defineGroup({
  name: "Search - Notifications",
});

export const searchListActionsGroup = defineGroup({
  name: "Search - List",
});

export const currentNotificationActionsGroup = defineGroup({
  name: (ctx) => {
    const notification = ctx.getTarget("notification");

    if (notification) return `Notification - ${getNotificationTitle(notification)}`;

    return "Notification";
  },
});

export const groupsPriority = [
  currentListActionsGroup,
  currentListActionsGroup,

  searchListActionsGroup,
  searchNotificationsGroup,

  navigationActionsGroup,
  appActionsGroup,
  accountActionsGroup,
  devActionsGroup,
];
