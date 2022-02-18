import { cachedComputed } from "@aca/clientdb";
import { getDb } from "@aca/desktop/clientdb";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { integrationClients } from "@aca/desktop/domains/integrations";
import { getNextItemInArray, getPreviousItemInArray } from "@aca/shared/array";
import { typedKeys } from "@aca/shared/object";

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

export const linearList = defineNotificationsList({
  id: "linear",
  name: "Linear",
  filter: (notification) => {
    return notification.kind === "notification_linear" && getShouldNotificationBeInInboxList(notification);
  },
});

const integrationLists = { slack: slackList, notion: notionList, figma: figmaList, linear: linearList };

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

export const getInboxLists = cachedComputed(() => {
  const availableIntegrationLists = typedKeys(integrationLists)
    .filter((key) => integrationClients[key].getIsConnected())
    .map((key) => integrationLists[key]);

  const customLists = getDb().notificationList.all.map((notificationFilter) =>
    defineNotificationsList({
      id: notificationFilter.id,
      name: notificationFilter.title,
      isCustom: true,
      getNotifications() {
        return notificationFilter.notifications.query({ isResolved: false }).all;
      },
    })
  );

  return [allNotificationsList, ...availableIntegrationLists, ...customLists];
});

export const outOfInboxLists = [snoozedList, resolvedList];

export function getInboxListById(id: string): NotificationsList | null {
  return getInboxLists().find((list) => list.id === id) ?? null;
}

export const isInboxList = (id: string) => Boolean(getInboxListById(id));

export function getOutOfInboxListsById(id: string): NotificationsList | null {
  return outOfInboxLists.find((list) => list.id === id) ?? null;
}

export function getInboxListsById(id: string): NotificationsList | null {
  return getInboxListById(id) ?? getOutOfInboxListsById(id) ?? null;
}

const getArrayItemOptions = { loop: true, keyGetter: (l: NotificationsList) => l.id };

export function getNextNotificationsList(list: NotificationsList) {
  const inboxListsValue = getInboxLists();

  if (inboxListsValue.some((inboxList) => inboxList.id === list.id)) {
    return getNextItemInArray(inboxListsValue, list, getArrayItemOptions);
  }
  if (outOfInboxLists.some((outOfInboxList) => outOfInboxList.id === list.id)) {
    return getNextItemInArray(outOfInboxLists, list, getArrayItemOptions);
  }

  return null;
}

export function getPreviousNotificationsList(list: NotificationsList) {
  const inboxListsValue = getInboxLists();
  if (inboxListsValue.some((inboxList) => inboxList.id === list.id)) {
    return getPreviousItemInArray(inboxListsValue, list, getArrayItemOptions);
  }

  if (outOfInboxLists.some((outOfInboxList) => outOfInboxList.id === list.id)) {
    return getPreviousItemInArray(outOfInboxLists, list, getArrayItemOptions);
  }

  return null;
}
