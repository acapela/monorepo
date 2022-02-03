import React from "react";

import { cachedComputed } from "@aca/clientdb";
import { defineAction, runActionWithTarget } from "@aca/desktop/actions/action";
import { createActionContext } from "@aca/desktop/actions/action/context";
import { allActions } from "@aca/desktop/actions/all";
import { searchListActionsGroup, searchNotificationsGroup } from "@aca/desktop/actions/groups";
import { goToList } from "@aca/desktop/actions/lists";
import { openFocusMode } from "@aca/desktop/actions/notification";
import { listsFuzzySearch } from "@aca/desktop/domains/list/search";
import { NotificationAppIcon } from "@aca/desktop/domains/notification/NotificationAppIcon";
import { notificationsFuzzySearch } from "@aca/desktop/domains/notification/search";
import { getNotificationTitle } from "@aca/desktop/domains/notification/title";
import { IconFolder } from "@aca/ui/icons";

import { CommandMenuSession } from "./session";

const getSearchActions = cachedComputed(function getSearchActions(keyword: string) {
  const notifications = notificationsFuzzySearch(keyword);

  const notificationActions = notifications.slice(0, 10).map((notification) =>
    defineAction({
      name: getNotificationTitle(notification),
      group: searchNotificationsGroup,
      icon: <NotificationAppIcon isOnDarkBackground notification={notification} />,
      handler() {
        runActionWithTarget(openFocusMode, notification);
      },
    })
  );

  const lists = listsFuzzySearch(keyword);

  const listActions = lists.slice(0, 10).map((list) =>
    defineAction({
      name: list.name,
      group: searchListActionsGroup,
      icon: <IconFolder />,
      handler() {
        runActionWithTarget(goToList, list);
      },
    })
  );

  return [...notificationActions, ...listActions];
});

export function createDefaultCommandMenuSession(): CommandMenuSession {
  const actionContext = createActionContext();

  return {
    actionContext,
    getActions({ keyword }) {
      if (!keyword.length) return allActions;
      return [...getSearchActions(keyword), ...allActions];
    },
  };
}
