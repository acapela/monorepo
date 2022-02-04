import React from "react";

import { openedNotificationsGroupsStore } from "@aca/desktop/domains/group/openedStore";
import { desktopRouter, getIsRouteActive } from "@aca/desktop/routes";
import { uiStore } from "@aca/desktop/store/uiStore";
import {
  IconArrowBottom,
  IconArrowCornerCwLt,
  IconArrowCornerCwRb,
  IconArrowLeft,
  IconArrowRight,
  IconArrowTop,
} from "@aca/ui/icons";

import { defineAction } from "./action";
import { ActionContext } from "./action/context";
import { defineGroup } from "./action/group";
import { listPageView } from "./views/list";

export const currentListActionsGroup = defineGroup({
  name: (ctx) => {
    const list = ctx.view(listPageView)?.list;

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
    const nextItem = context.assertView(listPageView).nextListItem;

    if (nextItem) {
      uiStore.focusedTarget = nextItem;
    }
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
    const prevItem = context.assertView(listPageView).prevListItem;

    if (prevItem) {
      uiStore.focusedTarget = prevItem;
    }
  },
});

export const goToNextList = defineAction({
  name: (ctx) => (ctx.isContextual ? "Next list" : "Go to next list"),
  group: currentListActionsGroup,
  canApply: () => {
    return getIsRouteActive("list");
  },
  icon: <IconArrowRight />,
  supplementaryLabel: (context) => context.assertView(listPageView).nextList?.name,
  shortcut: "ArrowRight",
  handler(context) {
    const nextList = context.assertView(listPageView).nextList;

    if (nextList) {
      desktopRouter.navigate("list", { listId: nextList.id });
    }
  },
});

export const goToPreviousList = defineAction({
  name: (ctx) => (ctx.isContextual ? "Previous list" : "Go to previous list"),
  group: currentListActionsGroup,
  icon: <IconArrowLeft />,
  canApply: () => {
    return getIsRouteActive("list");
  },
  supplementaryLabel: (context) => context.assertView(listPageView).prevList?.name,
  shortcut: "ArrowLeft",
  handler(context) {
    const prevList = context.assertView(listPageView).prevList;

    if (prevList) {
      desktopRouter.navigate("list", { listId: prevList.id });
    }
  },
});

function getGroupInfo(context: ActionContext) {
  const group = context.view(listPageView)?.focusedGroup;

  if (!group) return null;

  const isOpened = openedNotificationsGroupsStore.getIsOpened(group.id);

  return { group, isOpened };
}

export const toggleNotificationsGroup = defineAction({
  icon: (context) => (getGroupInfo(context)?.isOpened ? <IconArrowCornerCwLt /> : <IconArrowCornerCwRb />),
  group: currentListActionsGroup,
  name: (context) => {
    const isOpened = getGroupInfo(context)?.isOpened;

    if (isOpened === undefined) return "Toggle";

    if (context.isContextual) return isOpened ? "Collapse" : "Expand";

    return isOpened ? "Hide notifications in group" : "Show notifications in group";
  },
  supplementaryLabel: (ctx) => ctx.getTarget("group")?.name ?? undefined,
  shortcut: "Space",
  keywords: ["toggle", "group", "all"],
  canApply: (context) => {
    const focusedGroup = context.view(listPageView)?.focusedGroup;
    return Boolean(focusedGroup && !focusedGroup.isOnePreviewEnough);
  },
  handler(context) {
    const group = context.view(listPageView)?.focusedGroup;

    if (!group) return;
    const isOpenedNow = openedNotificationsGroupsStore.toggleOpen(group.id);

    if (!isOpenedNow) {
      uiStore.focusedTarget = group;
    }
  },
});
