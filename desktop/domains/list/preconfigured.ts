import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { getNextItemInArray, getPreviousItemInArray } from "@aca/shared/array";

import { NotificationsList, defineNotificationsList } from "./defineList";

function getShouldNotificationBeInInboxList(notification: NotificationEntity) {
  if (notification.resolved_at !== null) return false;
  if (notification.isSnoozed) return false;
  if (!notification.inner) return false;

  return true;
}

export const allNotificationsList = defineNotificationsList({
  id: "allNotifications",
  name: "Inbox",
  filter: getShouldNotificationBeInInboxList,
});

export const slackList = defineNotificationsList({
  id: "slack",
  name: "Slack",
  filter: (notification) => {
    return notification.kind === "notification_slack_message" && getShouldNotificationBeInInboxList(notification);
  },
});

export const notionList = defineNotificationsList({
  id: "notion",
  name: "Notion",
  filter: (notification) => {
    return notification.kind === "notification_notion" && getShouldNotificationBeInInboxList(notification);
  },
});

export const figmaList = defineNotificationsList({
  id: "figma",
  name: "Figma",
  filter: (notification) => {
    return notification.kind === "notification_figma_comment" && getShouldNotificationBeInInboxList(notification);
  },
});

export const resolvedList = defineNotificationsList({
  id: "resolved",
  name: "Resolved",
  filter: (notification) => notification.isResolved,
});

export const snoozedList = defineNotificationsList({
  id: "snoozed",
  name: "Snoozed",
  filter: (notification) => notification.isSnoozed,
});

export const inboxLists = [allNotificationsList, slackList, notionList, figmaList];

export const inboxListIdMap = {
  allNotifications: allNotificationsList,
  slack: slackList,
  notion: notionList,
  figma: figmaList,
};

export const outOfInboxLists = [snoozedList, resolvedList];

export const outOfInboxListIdMap = {
  resolved: resolvedList,
  snoozed: snoozedList,
};

export const allInboxLists = inboxLists.concat(outOfInboxLists);

export const allInboxListsIdMap = {
  ...inboxListIdMap,
  ...outOfInboxListIdMap,
};

export function getInboxListById(id: string): NotificationsList | null {
  return inboxListIdMap[id as keyof typeof inboxListIdMap] ?? null;
}

export function isInboxList(id: string): boolean {
  return !!inboxListIdMap[id as keyof typeof inboxListIdMap];
}

export function getOutOfInboxListsById(id: string): NotificationsList | null {
  return outOfInboxListIdMap[id as keyof typeof outOfInboxListIdMap] ?? null;
}

export function getInboxListsById(id: string): NotificationsList | null {
  return allInboxListsIdMap[id as keyof typeof allInboxListsIdMap] ?? null;
}

export function getNextNotificationsList(list: NotificationsList) {
  if (inboxLists.includes(list)) {
    return getNextItemInArray(inboxLists, list, { loop: true });
  }

  if (outOfInboxLists.includes(list)) {
    return getNextItemInArray(outOfInboxLists, list, { loop: true });
  }

  return null;
}

export function getPreviousNotificationsList(list: NotificationsList) {
  if (inboxLists.includes(list)) {
    return getPreviousItemInArray(inboxLists, list, { loop: true });
  }

  if (outOfInboxLists.includes(list)) {
    return getPreviousItemInArray(outOfInboxLists, list, { loop: true });
  }

  return null;
}
