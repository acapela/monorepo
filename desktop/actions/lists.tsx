import { getNextItemInArray, getPreviousItemInArray } from "@aca/shared/array";

import { preconfiguredLists } from "../domains/list/preconfigured";
import { desktopRouter, getIsRouteActive } from "../routes";
import { uiStore } from "../store/uiStore";
import { defineAction } from "./action";

export const goToList = defineAction({
  // TODO: when we have CMD + K - this can return `Open list...` and result in sub-actions select being opened if no target is set
  name: (context) => `${context.assertTarget("list").name}`,
  canApply: (context) => context.hasTargets("list"),
  handler(context) {
    desktopRouter.navigate("list", { listId: context.assertTarget("list").id });
  },
});

export const focusNextNotificationInList = defineAction({
  // TODO: when we have CMD + K - this can return `Open list...` and result in sub-actions select being opened if no target is set
  name: "Focus next notification in list",
  canApply: () => {
    return getIsRouteActive("list");
  },
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
  // TODO: when we have CMD + K - this can return `Open list...` and result in sub-actions select being opened if no target is set
  name: "Focus previous notification in list",
  canApply: (context) => {
    return getIsRouteActive("list") && context.hasTarget("notification");
  },
  shortcut: "ArrowUp",
  handler(context) {
    const list = context.assertTarget("list", true);
    const notification = context.assertTarget("notification");

    const previousNotification = list.getPreviousNotification(notification);

    if (!previousNotification) return;

    uiStore.focusedTarget = previousNotification;
  },
});

export const goToNextList = defineAction({
  // TODO: when we have CMD + K - this can return `Open list...` and result in sub-actions select being opened if no target is set
  name: "Go to next list",
  canApply: () => {
    return getIsRouteActive("list");
  },
  shortcut: "ArrowRight",
  handler(context) {
    const list = context.assertTarget("list", true);

    const nextList = getNextItemInArray(preconfiguredLists, list);

    desktopRouter.navigate("list", { listId: nextList.id });
  },
});

export const goToPreviousList = defineAction({
  // TODO: when we have CMD + K - this can return `Open list...` and result in sub-actions select being opened if no target is set
  name: "Go to previous list",
  canApply: () => {
    return getIsRouteActive("list");
  },
  shortcut: "ArrowLeft",
  handler(context) {
    const list = context.assertTarget("list", true);

    const previousList = getPreviousItemInArray(preconfiguredLists, list);

    desktopRouter.navigate("list", { listId: previousList.id });
  },
});
