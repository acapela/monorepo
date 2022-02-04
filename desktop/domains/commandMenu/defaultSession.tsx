import React from "react";

import { cachedComputed } from "@aca/clientdb";
import { defineAction } from "@aca/desktop/actions/action";
import { ActionContext, createActionContext } from "@aca/desktop/actions/action/context";
import { allActions } from "@aca/desktop/actions/all";
import { searchListActionsGroup, searchNotificationsGroup } from "@aca/desktop/actions/groups";
import { goToList } from "@aca/desktop/actions/lists";
import { openFocusMode } from "@aca/desktop/actions/notification";
import { getSnoozeOptionsForSearch } from "@aca/desktop/actions/snooze";
import { listsFuzzySearch } from "@aca/desktop/domains/list/search";
import { NotificationAppIcon } from "@aca/desktop/domains/notification/NotificationAppIcon";
import { notificationsFuzzySearch } from "@aca/desktop/domains/notification/search";
import { getNotificationTitle } from "@aca/desktop/domains/notification/title";
import { runActionWithTarget } from "@aca/desktop/domains/runAction";
import { pluralize } from "@aca/shared/text/pluralize";
import { IconFolder } from "@aca/ui/icons";

import { CommandMenuSession, createCommandMenuSession } from "./session";

const getSearchActions = cachedComputed(function getSearchActions(context: ActionContext) {
  const { searchKeyword } = context;
  const notifications = notificationsFuzzySearch(searchKeyword);

  const notificationActions = notifications.slice(0, 10).map((notification) =>
    defineAction({
      name: getNotificationTitle(notification),
      supplementaryLabel: () => notification.from,
      group: searchNotificationsGroup,
      keywords: [notification.from],
      icon: <NotificationAppIcon isOnDarkBackground notification={notification} />,
      handler() {
        runActionWithTarget(openFocusMode, notification);
      },
    })
  );

  const lists = listsFuzzySearch(searchKeyword);

  const listActions = lists.slice(0, 10).map((list) =>
    defineAction({
      name: list.name,
      supplementaryLabel: () => pluralize`${list.getAllNotifications().count} ${["notification"]}`,
      group: searchListActionsGroup,
      icon: <IconFolder />,
      handler() {
        runActionWithTarget(goToList, list);
      },
    })
  );

  return [...notificationActions, ...listActions, ...getSnoozeOptionsForSearch(context)];
});

export function createDefaultCommandMenuSession(): CommandMenuSession {
  const actionContext = createActionContext();

  return createCommandMenuSession({
    actionContext,
    getActions(context) {
      if (context.searchKeyword.length < 2) return allActions;
      return [...getSearchActions(context), ...allActions];
    },
  });
}
