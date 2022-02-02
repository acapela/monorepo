import React from "react";

import { inboxLists, isInboxList } from "@aca/desktop/domains/list/preconfigured";
import { desktopRouter, getIsRouteActive } from "@aca/desktop/routes";
import { uiStore } from "@aca/desktop/store/uiStore";
import { getNextItemInArray, getPreviousItemInArray } from "@aca/shared/array";
import { IconArrowBottom, IconArrowLeft, IconArrowRight, IconArrowTop } from "@aca/ui/icons";

import { defineAction } from "./action";
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

    if (!notification) {
      uiStore.focusedTarget = list.getAllNotifications().first;
      return;
    }

    const nextNotification = list.getNextNotification(notification);

    if (!nextNotification) return;

    uiStore.focusedTarget = nextNotification;
  },
});

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

    if (!notification) {
      uiStore.focusedTarget = list.getAllNotifications().last;
      return;
    }

    const previousNotification = list.getPreviousNotification(notification);

    if (!previousNotification) return;

    uiStore.focusedTarget = previousNotification;
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

    const nextList = getNextItemInArray(inboxLists, list);

    desktopRouter.navigate("list", { listId: nextList.id });
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

    const previousList = getPreviousItemInArray(inboxLists, list);

    desktopRouter.navigate("list", { listId: previousList.id });
  },
});
