import { uniq } from "lodash";
import React from "react";

import { cachedComputed } from "@aca/clientdb";
import { defineAction } from "@aca/desktop/actions/action";
import { ActionContext } from "@aca/desktop/actions/action/context";
import { searchListActionsGroup, searchNotificationsGroup } from "@aca/desktop/actions/groups";
import { goToList } from "@aca/desktop/actions/lists";
import { openFocusMode } from "@aca/desktop/actions/notification";
import { groupNotifications } from "@aca/desktop/domains/group/groupNotifications";
import { listsFuzzySearch } from "@aca/desktop/domains/list/search";
import { NotificationAppIcon } from "@aca/desktop/domains/notification/NotificationAppIcon";
import { notificationsFuzzySearch } from "@aca/desktop/domains/notification/search";
import { getNotificationTitle } from "@aca/desktop/domains/notification/title";
import { runActionWithTarget } from "@aca/desktop/domains/runAction";
import { pluralize } from "@aca/shared/text/pluralize";
import { IconFolder, IconSearch } from "@aca/ui/icons";

import { defineGroup } from "./action/group";

export const accountActionsGroup = defineGroup({
  name: "Account",
});

export function getContextualServiceName(name: string) {
  return (ctx: ActionContext) => (ctx.isContextual ? "Connect" : `Connect ${name}`);
}

export const findNotification = defineAction({
  name: "Find notifications and lists...",
  keywords: ["search"],
  shortcut: ["Meta", "F"],
  group: accountActionsGroup,
  alwaysShowInSearch: true,
  icon: <IconSearch />,
  async handler(context) {
    const { searchKeyword } = context;

    return {
      hideTarget: true,
      initialSearchValue: searchKeyword,
      searchPlaceholder: "Find notifications and lists...",
      getActions(context) {
        return getSearchActions(context);
      },
    };
  },
});

const getSearchActions = cachedComputed(function getSearchActions(context: ActionContext) {
  const { searchKeyword } = context;
  const notifications = notificationsFuzzySearch(searchKeyword);

  // TODO(performance) is this performant?
  const notificationActions = groupNotifications(notifications)
    .slice(0, 10)
    .map((notificationOrGroup) => {
      if (notificationOrGroup.kind === "group") {
        return defineAction({
          name: notificationOrGroup.name,
          supplementaryLabel: () => pluralize`${notificationOrGroup.notifications.length} ${["notification"]}`,
          group: searchNotificationsGroup,
          keywords: [
            notificationOrGroup.integrationTitle,
            ...uniq(notificationOrGroup.notifications.map((n) => n.from)),
          ],
          icon: <NotificationAppIcon isOnDarkBackground notification={notificationOrGroup.notifications[0]} />,
          handler() {
            runActionWithTarget(openFocusMode, notificationOrGroup.notifications[0]);
          },
        });
      }

      return defineAction({
        name: getNotificationTitle(notificationOrGroup),
        supplementaryLabel: () => notificationOrGroup.from,
        group: searchNotificationsGroup,
        keywords: [notificationOrGroup.from],
        icon: <NotificationAppIcon isOnDarkBackground notification={notificationOrGroup} />,
        handler() {
          runActionWithTarget(openFocusMode, notificationOrGroup);
        },
      });
    });

  const lists = listsFuzzySearch(searchKeyword);

  const listActions = lists.slice(0, 10).map((list) =>
    defineAction({
      name: list.name,
      supplementaryLabel: () => pluralize`${list.getAllNotifications().length} ${["notification"]}`,
      group: searchListActionsGroup,
      icon: () => list.icon ?? <IconFolder />,
      handler() {
        runActionWithTarget(goToList, list);
      },
    })
  );

  return [...notificationActions, ...listActions];
});
