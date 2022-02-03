import React from "react";

import { getNotificationParentGroupInList } from "@aca/desktop/domains/group/findGroup";
import { openedNotificationsGroupsStore } from "@aca/desktop/domains/group/openedStore";
import { getNextVisibleItemInList, getPreviousVisibleItemInList } from "@aca/desktop/domains/list/getNextItemInList";
import { inboxLists, isInboxList } from "@aca/desktop/domains/list/preconfigured";
import { desktopRouter, getIsRouteActive } from "@aca/desktop/routes";
import { uiStore } from "@aca/desktop/store/uiStore";
import { getNextItemInArray, getPreviousItemInArray } from "@aca/shared/array";
import { IconArrowBottom, IconArrowCornerCwRb, IconArrowLeft, IconArrowRight, IconArrowTop } from "@aca/ui/icons";

import { defineAction } from "./action";
import { ActionContext } from "./action/context";
import { defineGroup } from "./action/group";

export const currentListActionsGroup = defineGroup({
  name: (ctx) => {
    const list = ctx.getTarget("list");

    if (list) return `List - ${list.name}`;

    return "List";
  },
});

export const goToList = defineAction({
  name: (context) => {
    const list = context.getTarget("list");

    if (!list) return "Open list";

    if (context.isContextual) return list.name;

    return list.name;
  },
  private: true,
  group: currentListActionsGroup,
  canApply: (context) => context.hasTarget("list"),
  handler(context) {
    desktopRouter.navigate("list", { listId: context.assertTarget("list").id });
  },
});

export const focusNextNotificationInList = defineAction({
  name: (ctx) => (ctx.isContextual ? "Next" : "Focus next notification in list"),
  group: currentListActionsGroup,
  canApply: () => {
    return getIsRouteActive("list");
  },
  icon: <IconArrowBottom />,
  shortcut: "ArrowDown",
  handler(context) {
    const list = context.assertTarget("list", true);
    const notification = context.getTarget("notification");
    const group = context.getTarget("group");

    const nextItem = getNextVisibleItemInList(list, notification ?? group ?? undefined);

    if (nextItem) {
      uiStore.focusedTarget = nextItem;
    }
  },
});

export function getNextVisibleItemInListMode(context: ActionContext) {
  const list = context.assertTarget("list", true);
  const notification = context.getTarget("notification");
  const group = context.getTarget("group");

  return getPreviousVisibleItemInList(list, notification ?? group ?? undefined);
}

export function getPrevVisibleItemInListMode(context: ActionContext) {
  const list = context.assertTarget("list", true);
  const notification = context.getTarget("notification");
  const group = context.getTarget("group");

  return getNextVisibleItemInList(list, notification ?? group ?? undefined);
}

export const focusPreviousNotificationInList = defineAction({
  name: (ctx) => (ctx.isContextual ? "Previous" : "Focus previous notification in list"),
  group: currentListActionsGroup,
  canApply: () => {
    return getIsRouteActive("list");
  },
  icon: <IconArrowTop />,
  shortcut: "ArrowUp",
  handler(context) {
    const list = context.assertTarget("list", true);
    const notification = context.getTarget("notification");
    const group = context.getTarget("group");

    const previousItem = getPreviousVisibleItemInList(list, notification ?? group ?? undefined);

    if (previousItem) {
      uiStore.focusedTarget = previousItem;
    }
  },
});

export const goToNextList = defineAction({
  name: (ctx) => (ctx.isContextual ? "Next list" : "Go to next list"),
  group: currentListActionsGroup,
  canApply: (context) => {
    const list = context.getTarget("list", true);
    return getIsRouteActive("list") && isInboxList(list?.id ?? "");
  },
  icon: <IconArrowRight />,
  shortcut: "ArrowRight",
  handler(context) {
    const list = context.assertTarget("list", true);

    const nextList = getNextItemInArray(inboxLists, list, { loop: true });

    if (nextList) {
      desktopRouter.navigate("list", { listId: nextList.id });
    }
  },
});

export const goToPreviousList = defineAction({
  name: (ctx) => (ctx.isContextual ? "Previous list" : "Go to previous list"),
  group: currentListActionsGroup,
  icon: <IconArrowLeft />,
  canApply: (context) => {
    const list = context.getTarget("list", true);
    return getIsRouteActive("list") && isInboxList(list?.id ?? "");
  },
  shortcut: "ArrowLeft",
  handler(context) {
    const list = context.assertTarget("list", true);

    const previousList = getPreviousItemInArray(inboxLists, list, { loop: true });

    if (previousList) {
      desktopRouter.navigate("list", { listId: previousList.id });
    }
  },
});

function getNotificationTargetGroup(context: ActionContext) {
  const group = context.getTarget("group");
  if (group) return group;

  const list = context.getTarget("list", true);
  const notification = context.getTarget("notification");

  if (!notification || !list) return null;

  const targetGroup = getNotificationParentGroupInList(notification, list);

  return targetGroup;
}

export const toggleNotificationsGroup = defineAction({
  icon: <IconArrowCornerCwRb />,
  group: currentListActionsGroup,
  name: (ctx) => (ctx.isContextual ? "Toggle" : "Show/hide notifications in group"),
  shortcut: "Space",
  keywords: ["toggle", "group", "all"],
  canApply: (context) => {
    return !!getNotificationTargetGroup(context);
  },
  handler(context) {
    const group = getNotificationTargetGroup(context);

    if (!group) return;
    const isOpenedNow = openedNotificationsGroupsStore.toggleOpen(group.id);

    if (!isOpenedNow) {
      uiStore.focusedTarget = group;
    }
  },
});
