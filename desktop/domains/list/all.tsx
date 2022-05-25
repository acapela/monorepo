import React from "react";

import { cachedComputed } from "@aca/clientdb";
import { getDb } from "@aca/desktop/clientdb";
import { NotificationListEntity } from "@aca/desktop/clientdb/list";
import { integrationClients } from "@aca/desktop/domains/integrations";
import { IntegrationIcon } from "@aca/desktop/domains/integrations/IntegrationIcon";
import { getNextItemInArray, getPreviousItemInArray } from "@aca/shared/array";
import { weakMemoize } from "@aca/shared/deepMap";
import { IconClock, IconListUnordered4 } from "@aca/ui/icons";

import { NotificationsList, defineNotificationsList } from "./defineList";

export const allNotificationsList = defineNotificationsList({
  id: "allNotifications",
  name: "All",
  filter: { isResolved: false, isSnoozed: false },
});

const getAvailableIntegrationLists = cachedComputed(() =>
  Object.values(integrationClients)
    .filter((client) => client.getAccounts().length > 0)
    .map((client) =>
      defineNotificationsList({
        id: client.notificationTypename,
        name: client.name,
        icon: <IntegrationIcon integrationClient={client} />,
        filter: { kind: client.notificationTypename, isResolved: false, isSnoozed: false },
      })
    )
);

export const resolvedList = defineNotificationsList({
  id: "resolved",
  name: "Resolved",
  icon: <IconListUnordered4 />,
  dontShowCount: true,
  filter: { isResolved: true },
  sort: (notification) => -1 * notification.resolvedAtTimestamp!,
  dontPreload: true,
});

export const snoozedList = defineNotificationsList({
  id: "snoozed",
  name: "Snoozed",
  icon: <IconClock />,
  filter: { isSnoozed: true },
});

export const canListShowZenScreen = (list: NotificationsList) => {
  return list.id !== snoozedList.id && list.id !== resolvedList.id;
};

const createNotificationsListFromListEntity = weakMemoize((listEntity: NotificationListEntity) => {
  return defineNotificationsList({
    id: listEntity.id,
    name: listEntity.title,
    listEntity: listEntity,
    isCustom: true,
    getNotifications: () => listEntity.inboxNotifications.all,
  });
});

export const getInboxLists = cachedComputed(() => {
  const customLists = getDb().notificationList.all.map((listEntity) =>
    createNotificationsListFromListEntity(listEntity)
  );
  return [allNotificationsList, ...customLists, ...getAvailableIntegrationLists()];
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
