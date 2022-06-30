import React from "react";

import { defineAction } from "@aca/desktop/actions/action";
import { ActionContext, createActionContext } from "@aca/desktop/actions/action/context";
import { allActions } from "@aca/desktop/actions/all";
import { isNotificationAction, searchListActionsGroup } from "@aca/desktop/actions/groups";
import { goToList } from "@aca/desktop/actions/lists";
import { getReminderOptionsForSearch } from "@aca/desktop/actions/reminders";
import { listsFuzzySearch } from "@aca/desktop/domains/list/search";
import { runActionWith } from "@aca/desktop/domains/runAction";
import { pluralize } from "@aca/shared/text/pluralize";
import { IconFolder } from "@aca/ui/icons";
import { cachedComputed } from "@acapela/clientdb";

import { CommandMenuSession, createCommandMenuSession } from "./session";

const getSearchActions = cachedComputed(function getSearchActions(context: ActionContext) {
  const { searchKeyword } = context;

  const lists = listsFuzzySearch(searchKeyword);

  const listActions = lists.slice(0, 10).map((list) =>
    defineAction({
      name: list.name,
      supplementaryLabel: () => pluralize`${list.getAllNotifications().length} ${["notification"]}`,
      group: searchListActionsGroup,
      icon: <IconFolder />,
      handler() {
        runActionWith(goToList, list);
      },
    })
  );

  return [...listActions, ...getReminderOptionsForSearch(context)];
});

export function createDefaultCommandMenuSession(): CommandMenuSession {
  const actionContext = createActionContext();

  const notificationActions = allActions.filter(isNotificationAction);
  const remainingActions = allActions.filter((ac) => !isNotificationAction(ac));

  // Prioritize actions from our main entity
  const sortedActions = [...notificationActions, ...remainingActions];

  return createCommandMenuSession({
    actionContext,
    getActions(context) {
      if (context.searchKeyword.length < 2) return sortedActions;
      return [...getSearchActions(context), ...sortedActions];
    },
  });
}
