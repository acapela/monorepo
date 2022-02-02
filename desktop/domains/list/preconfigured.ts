import { NotificationEntity } from "@aca/desktop/clientdb/notification";

import { DefinedList, defineList } from "./defineList";

function getIsNotificationNotResolved(notification: NotificationEntity) {
  if (notification.resolved_at !== null) return false;
  if (!notification.inner) return false;

  return true;
}

export const allNotificationsList = defineList({
  id: "allNotifications",
  name: "Inbox",
  filter: getIsNotificationNotResolved,
});

export const slackList = defineList({
  id: "slack",
  name: "Slack",
  filter: (notification) => {
    return notification.kind === "notification_slack_message" && getIsNotificationNotResolved(notification);
  },
});

export const notionList = defineList({
  id: "notion",
  name: "Notion",
  filter: (notification) => {
    return notification.kind === "notification_notion" && getIsNotificationNotResolved(notification);
  },
});

export const figmaList = defineList({
  id: "figma",
  name: "Figma",
  filter: (notification) => {
    return notification.kind === "notification_figma_comment" && getIsNotificationNotResolved(notification);
  },
});

export const resolvedList = defineList({
  id: "resolved",
  name: "Resolved",
  filter: (notification) => !!notification.resolved_at,
});

export const inboxLists = [allNotificationsList, slackList, notionList, figmaList];

export const inboxListIdMap = {
  allNotifications: allNotificationsList,
  slack: slackList,
  notion: notionList,
  figma: figmaList,
};

export const outOfInboxLists = [resolvedList];

export const outOfInboxListIdMap = {
  resolved: resolvedList,
};

export const allInboxLists = inboxLists.concat(outOfInboxLists);

export const allInboxListsIdMap = {
  ...inboxListIdMap,
  ...outOfInboxListIdMap,
};

export function getInboxListById(id: string): DefinedList | null {
  return inboxListIdMap[id as keyof typeof inboxListIdMap] ?? null;
}

export function isInboxList(id: string): boolean {
  return !!inboxListIdMap[id as keyof typeof inboxListIdMap];
}

export function getOutOfInboxListsById(id: string): DefinedList | null {
  return outOfInboxListIdMap[id as keyof typeof outOfInboxListIdMap] ?? null;
}

export function getAllInboxListsById(id: string): DefinedList | null {
  return allInboxListsIdMap[id as keyof typeof allInboxListsIdMap] ?? null;
}
