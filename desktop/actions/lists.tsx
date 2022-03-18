import React from "react";

import { getDb } from "@aca/desktop/clientdb";
import { allNotificationsList } from "@aca/desktop/domains/list/all";
import { desktopRouter, getIsRouteActive } from "@aca/desktop/routes";
import { uiStore } from "@aca/desktop/store/ui";
import { IconArrowBottom, IconArrowTop, IconEdit2, IconPlus, IconSlidersHoriz, IconTrash } from "@aca/ui/icons";

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

const canApplyCustomListAction = (ctx: ActionContext) => !!ctx.getTarget("list")?.isCustom;

export const renameNotificationList = defineAction({
  icon: <IconEdit2 />,
  name: "Rename list",
  keywords: ["change", "name", "title"],
  group: currentListActionsGroup,
  supplementaryLabel: (ctx) => ctx.getTarget("list")?.name,

  canApply: canApplyCustomListAction,
  handler: (ctx) => {
    const list = ctx.assertTarget("list");
    return {
      searchPlaceholder: "List name...",
      initialSearchValue: list.name,
      getActions: () => [
        defineAction({
          name: (ctx) =>
            `Rename list "${ctx.assertTarget("list").name}"` + (ctx.searchKeyword ? ` to "${ctx.searchKeyword}"` : ""),
          handler(ctx) {
            const list = ctx.assertTarget("list");
            const title = ctx.searchKeyword.trim();
            if (!title) {
              return;
            }
            getDb().notificationList.findById(list.id)?.update({ title });
          },
        }),
      ],
    };
  },
});

export const editNotificationList = defineAction({
  icon: <IconSlidersHoriz />,
  group: currentListActionsGroup,

  name: "Edit list filters",
  supplementaryLabel: (ctx) => ctx.view(listPageView)?.list.name,

  keywords: ["filters"],
  canApply: canApplyCustomListAction,
  handler(ctx) {
    const { list } = ctx.assertView(listPageView);
    desktopRouter.navigate("list", { listId: list.id, isEditing: "true" });
  },
});

export const deleteNotificationList = defineAction({
  icon: <IconTrash />,
  group: currentListActionsGroup,

  name: () => "Delete list",
  supplementaryLabel: (ctx) => ctx.view(listPageView)?.list.name,

  keywords: ["remove", "trash"],
  analyticsEvent: "Custom List Deleted",
  canApply: canApplyCustomListAction,
  handler(ctx) {
    const { list } = ctx.assertView(listPageView);
    desktopRouter.navigate("list", { listId: allNotificationsList.id });
    getDb().notificationList.removeById(list.id);
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
  icon: (ctx) => ctx.getTarget("list")?.icon,
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
  icon: <IconArrowBottom />,
  supplementaryLabel: (context) => context.view(listPageView)?.nextList?.name,
  shortcut: ["Tab"],
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
  icon: <IconArrowTop />,
  canApply: () => {
    return getIsRouteActive("list");
  },
  supplementaryLabel: (context) => context.view(listPageView)?.prevList?.name,
  shortcut: ["Shift", "Tab"],
  handler(context) {
    const prevList = context.assertView(listPageView).prevList;

    if (prevList) {
      desktopRouter.navigate("list", { listId: prevList.id });
    }
  },
});

export const createNotificationList = defineAction({
  icon: <IconPlus />,
  name: (ctx) => (ctx.isContextual ? "New list" : "New notifications list"),
  keywords: ["new list", "bucket", "add"],
  handler: () => ({
    searchPlaceholder: "New list name...",
    getActions: () => [
      defineAction({
        name: (ctx) => `Create list "${ctx.searchKeyword}"`,
        analyticsEvent: "Custom List Created",
        handler(ctx) {
          const title = ctx.searchKeyword.trim();
          if (!title) {
            return false;
          }
          const notificationFilter = getDb().notificationList.create({
            title,
            filters: [],
            seen_at: new Date().toISOString(),
          });
          desktopRouter.navigate("list", { listId: notificationFilter.id, isEditing: "true" });
        },
      }),
    ],
  }),
});
