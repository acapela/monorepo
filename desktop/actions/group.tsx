import React from "react";

// import { trackingEvent } from "@aca/desktop/analytics";
import { openedNotificationsGroupsStore } from "@aca/desktop/domains/group/openedStore";
import { uiStore } from "@aca/desktop/store/ui";
import { IconArrowCornerCwLt, IconArrowCornerCwRb } from "@aca/ui/icons";

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

function getGroupInfo(context: ActionContext) {
  const group = context.view(listPageView)?.focusedGroup;

  if (!group) return null;

  const isOpened = openedNotificationsGroupsStore.getIsOpened(group.id);

  return { group, isOpened };
}

export const toggleNotificationsGroup = defineAction({
  icon: (context) => (getGroupInfo(context)?.isOpened ? <IconArrowCornerCwLt /> : <IconArrowCornerCwRb />),
  // analyticsEvent: trackingEvent("Notification Group Toggled"),
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
