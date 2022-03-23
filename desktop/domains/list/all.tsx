import React from "react";

import { cachedComputed } from "@aca/clientdb";
import { getDb } from "@aca/desktop/clientdb";
import { NotificationListEntity } from "@aca/desktop/clientdb/list";
import { integrationClients } from "@aca/desktop/domains/integrations";
import { jiraIntegrationClient } from "@aca/desktop/domains/integrations/jira";
import { getNextItemInArray, getPreviousItemInArray } from "@aca/shared/array";
import { weakMemoize } from "@aca/shared/deepMap";
import { typedKeys } from "@aca/shared/object";
import { IconClock, IconListUnordered4 } from "@aca/ui/icons";

import { figmaIntegrationClient } from "../integrations/figma";
import { linearIntegrationClient } from "../integrations/linear";
import { notionIntegrationClient } from "../integrations/notion";
import { slackIntegrationClient } from "../integrations/slack";
import { NotificationsList, defineNotificationsList } from "./defineList";

export const allNotificationsList = defineNotificationsList({
  id: "allNotifications",
  name: "All",
  filter: { isResolved: false, isSnoozed: false },
});

export const slackList = defineNotificationsList({
  id: "slack",
  name: "Slack",
  icon: slackIntegrationClient.icon,
  filter: { kind: "notification_slack_message", isResolved: false, isSnoozed: false },
});

export const notionList = defineNotificationsList({
  id: "notion",
  name: "Notion",
  icon: notionIntegrationClient.icon,
  filter: { kind: "notification_notion", isResolved: false, isSnoozed: false },
});

export const figmaList = defineNotificationsList({
  id: "figma",
  name: "Figma",
  icon: figmaIntegrationClient.icon,
  filter: { kind: "notification_figma_comment", isResolved: false, isSnoozed: false },
});

export const linearList = defineNotificationsList({
  id: "linear",
  name: "Linear",
  icon: linearIntegrationClient.icon,
  filter: { kind: "notification_linear", isResolved: false, isSnoozed: false },
});

export const jiraList = defineNotificationsList({
  id: "jira",
  name: "Jira",
  icon: jiraIntegrationClient.icon,
  filter: { kind: "notification_jira_issue", isResolved: false, isSnoozed: false },
});

const integrationLists = { slack: slackList, notion: notionList, figma: figmaList, linear: linearList, jira: jiraList };

export const resolvedList = defineNotificationsList({
  id: "resolved",
  name: "Resolved",
  icon: <IconListUnordered4 />,
  dontShowCount: true,
  filter: { isResolved: true },
});

export const snoozedList = defineNotificationsList({
  id: "snoozed",
  name: "Snoozed",
  icon: <IconClock />,
  filter: { isSnoozed: true },
});

const createNotificationsListFromListEntity = weakMemoize((listEntity: NotificationListEntity) => {
  return defineNotificationsList({
    id: listEntity.id,
    name: listEntity.title,
    listEntity: listEntity,
    isCustom: true,
    query: listEntity.inboxNotifications,
  });
});

export const getInboxLists = cachedComputed(() => {
  const availableIntegrationLists = typedKeys(integrationLists)
    .filter((key) => integrationClients[key].getAccounts().length)
    .map((key) => integrationLists[key]);

  const customLists = getDb().notificationList.all.map((listEntity) =>
    createNotificationsListFromListEntity(listEntity)
  );

  return [allNotificationsList, ...customLists, ...availableIntegrationLists];
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
