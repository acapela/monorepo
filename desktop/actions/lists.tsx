import { defer } from "lodash";
import { runInAction } from "mobx";
import React from "react";

import { getDb } from "@aca/desktop/clientdb";
import { allNotificationsList } from "@aca/desktop/domains/list/all";
import { desktopRouter, getIsRouteActive } from "@aca/desktop/routes";
import { uiStore } from "@aca/desktop/store/ui";
import { createCleanupObject } from "@aca/shared/cleanup";
import { pluralize } from "@aca/shared/text/pluralize";
import {
  IconArrowBottom,
  IconArrowTop,
  IconEdit2,
  IconListUnordered4,
  IconPlus,
  IconSlidersHoriz,
  IconTrash,
} from "@aca/ui/icons";

import { createAnalyticsEvent } from "../analytics";
import { showConfirmDialogRequest } from "../bridge/dialogs";
import { addToast } from "../domains/toasts/store";
import { defineAction } from "./action";
import { ActionContext } from "./action/context";
import { defineGroup } from "./action/group";
import { displayZenModeIfFinished } from "./views/common";
import { listPageView } from "./views/list";

export const currentListActionsGroup = defineGroup({
  name: (ctx) => {
    const list = ctx.view(listPageView)?.list;

    if (list) return `List - ${list.name}`;

    return "List";
  },
});

const canApplyCustomListAction = (ctx: ActionContext) => !!ctx.getTarget("list", true)?.isCustom;

export const renameNotificationList = defineAction({
  icon: <IconEdit2 />,
  name: "Rename list",
  keywords: ["change", "name", "title"],
  group: currentListActionsGroup,
  supplementaryLabel: (ctx) => ctx.getTarget("list", true)?.name,

  canApply: canApplyCustomListAction,
  handler: (ctx) => {
    const list = ctx.assertTarget("list", true);
    return {
      searchPlaceholder: "List name...",
      initialSearchValue: list.name,
      getActions: () => [
        defineAction({
          name: (ctx) => `Rename list "${list.name}"` + (ctx.searchKeyword ? ` to "${ctx.searchKeyword}"` : ""),
          handler(ctx) {
            const title = ctx.searchKeyword.trim();
            if (!title) {
              return;
            }

            const undo = list.listEntity!.update({ title }).undo;

            addToast({
              message: `List renamed`,
              action: {
                label: `Undo`,
                callback: () => undo?.(),
              },
            });
          },
        }),
      ],
    };
  },
});

export const resolveAllNotifications = defineAction({
  icon: <IconListUnordered4 />,
  group: currentListActionsGroup,
  name: (ctx) => {
    return ctx.isContextual ? "Resolve all" : "Resolve all notifications in list";
  },
  analyticsEvent: (ctx) => {
    const list = ctx.getTarget("list", true);

    if (list) {
      return createAnalyticsEvent("All Notifications Resolved", { list_id: list.id });
    }
  },
  keywords: ["done", "next", "mark", "complete", "every", "clean"],
  supplementaryLabel: (ctx) => ctx.getTarget("list", true)?.name ?? undefined,
  canApply: (ctx) => {
    return !!ctx.getTarget("list", true)?.getAllNotifications().length;
  },
  handler(context) {
    const list = context.assertTarget("list");

    const allNotifications = list.getAllNotifications();

    const cancel = createCleanupObject();

    runInAction(() => {
      for (const nextNotification of allNotifications) {
        if (nextNotification.isResolved) continue;
        cancel.next = nextNotification.resolve()?.undo;
      }
    });

    if (!cancel.size) return;

    // Waiting for lists to get updated
    defer(() => {
      displayZenModeIfFinished(context);
    });

    addToast({
      message: pluralize`${cancel.size} ${["notification"]} resolved`,
      action: {
        label: "Undo",
        callback() {
          cancel.clean("from-last");
        },
      },
    });
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
  async handler(ctx) {
    const { list } = ctx.assertView(listPageView);
    const didConfirm = await showConfirmDialogRequest({
      message: "Remove list?",
      detail: `Sure you want to remove "${list.name}"?`,
      confirmLabel: "Remove",
    });

    if (!didConfirm) return;

    desktopRouter.navigate("list", { listId: allNotificationsList.id });
    getDb().notificationList.removeById(list.id);

    addToast({
      message: `List removed`,
    });
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

          addToast({
            message: `List created`,
          });
        },
      }),
    ],
  }),
});
