import { chain } from "lodash";
import React from "react";

import { getDb } from "@aca/desktop/clientdb";
import { NotificationListEntity, notificationListEntity } from "@aca/desktop/clientdb/list";
import { integrationClients } from "@aca/desktop/domains/integrations";
import { IntegrationIcon } from "@aca/desktop/domains/integrations/IntegrationIcon";
import { getNextItemInArray, getPreviousItemInArray } from "@aca/shared/array";
import { weakMemoize } from "@aca/shared/deepMap";
import { IconBookmark, IconInbox, IconListUnordered4 } from "@aca/ui/icons";
import { cachedComputed } from "@acapela/clientdb";

import { NotificationsList, defineNotificationsList } from "./defineList";
import { ListSystemId, SYSTEM_LISTS_TIP } from "./system";

export const allNotificationsList = defineNotificationsList({
  id: "allNotifications",
  name: "Inbox",
  icon: <IconInbox />,
  filter: { isResolved: false, hasReminder: false, isSaved: false },
  tip: "This list will contain every single notification you receive",
});

export const savedNotificationsList = defineNotificationsList({
  id: "saved",
  name: "Saved",
  icon: <IconBookmark />,
  tip: `This list will show notifications you saved or have set reminders for.`,
  filter: { isResolved: false, $or: [{ hasReminder: true }, { isSaved: true }] },
});

const getAvailableIntegrationLists = cachedComputed(
  () =>
    chain(Object.values(integrationClients))
      .filter((client) => client.getAccounts().length > 0 || !!client.requiresReconnection?.())
      .orderBy((client) => !client.requiresReconnection?.(), "desc")
      .map((client) =>
        defineNotificationsList({
          id: client.notificationTypename,
          isHidden: client.isHiddenFromSidebar?.(),
          requiresReconnection: client.requiresReconnection?.(),
          name: client.name,
          icon: <IntegrationIcon integrationClient={client} />,
          filter: { kind: client.notificationTypename, isResolved: false, hasReminder: false, isSaved: false },
        })
      )
      .value(),
  // Result of this function is observable (Eg. client.getAccounts().length) - let's guard ourself from accidentally saving result of this function outside of observable context (eg. module root variable)
  { requiresReaction: true }
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

export const canListShowZenScreen = (list: NotificationsList) => {
  return list.id !== resolvedList.id;
};

const createNotificationsListFromListEntity = weakMemoize((listEntity: NotificationListEntity) => {
  return defineNotificationsList({
    id: listEntity.id,
    name: listEntity.title,
    listEntity: listEntity,
    tip: listEntity.system_id ? SYSTEM_LISTS_TIP[listEntity.system_id as ListSystemId] : undefined,
    getNotifications: () => listEntity.inboxNotifications.all,
  });
});

export const getInboxLists = cachedComputed(
  () => {
    const customLists = getDb()
      .entity(notificationListEntity)
      .all.map((listEntity) => createNotificationsListFromListEntity(listEntity));
    return [...customLists, savedNotificationsList, allNotificationsList, ...getAvailableIntegrationLists()];
  },
  // Result of this function is observable (eg. depends on database being present and notifications lists) - let's guard ourself from accidentally saving result of this function outside of observable context (eg. module root variable)
  { requiresReaction: true }
);

export const outOfInboxLists = [resolvedList];

export function getInboxListById(id: string): NotificationsList | null {
  return getInboxLists().find((list) => list.id === id || list.systemId === id) ?? null;
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
