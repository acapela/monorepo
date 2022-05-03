import { nextMonday, setDay, setHours, startOfTomorrow } from "date-fns";
import React from "react";

import { createCleanupObject } from "@aca/shared/cleanup";
import { DateSuggestion, autosuggestDate } from "@aca/shared/dates/autocomplete/suggestions";
import { niceFormatDateTime } from "@aca/shared/dates/format";
import { pluralize } from "@aca/shared/text/pluralize";
import { IconClock } from "@aca/ui/icons";

import { getDb } from "../clientdb";
import { getIsNotificationsGroup } from "../domains/group/group";
import { groupNotifications } from "../domains/group/groupNotifications";
import { addToast } from "../domains/toasts/store";
import { defineAction } from "./action";
import { ActionContext } from "./action/context";
import { currentNotificationActionsGroup } from "./groups";
import { displayZenModeIfFinished, focusNextItemIfAvailable } from "./views/common";

export function canApplySnooze(context: ActionContext) {
  if (context.getTarget("notification")?.canSnooze === true) return true;
  if (context.getTarget("group")?.notifications.some((notification) => notification.canSnooze) === true) return true;

  return false;
}

export function getSnoozeOptionsForSearch(context: ActionContext) {
  if (!canApplySnooze(context)) return [];

  return getSnoozeSuggestionActions(context);
}

const DEFAULT_WORK_START_HOUR = 9;
const DEFAULT_WORK_END_HOUR = 17;

const defaultSuggestions: DateSuggestion[] = [
  {
    text: "End of day",
    get date() {
      return setHours(new Date(), DEFAULT_WORK_END_HOUR);
    },
  },
  {
    text: "Tomorrow",
    get date() {
      return setHours(startOfTomorrow(), DEFAULT_WORK_START_HOUR);
    },
  },
  {
    text: "End of week",
    get date() {
      return setHours(setDay(new Date(), 5), DEFAULT_WORK_START_HOUR);
    },
  },
  {
    text: "Next week",
    get date() {
      return setHours(nextMonday(new Date()), DEFAULT_WORK_START_HOUR);
    },
  },
];

export function getSnoozeSuggestionActions(context: ActionContext) {
  const dateSuggestions = getSnoozeSuggestions(context);

  const snoozeActions = dateSuggestions.map(convertDateSuggestionToAction);

  return snoozeActions;
}

function getSnoozeSuggestions({ searchKeyword, isContextual }: ActionContext): DateSuggestion[] {
  if (!searchKeyword.trim()) return defaultSuggestions;

  return autosuggestDate(searchKeyword, { maxResults: isContextual ? 5 : 2 }).map((suggestion) => {
    if (suggestion.isExact) return suggestion;
    return {
      ...suggestion,
      date: setHours(suggestion.date, DEFAULT_WORK_START_HOUR),
    };
  });
}

function convertDateSuggestionToAction(suggestion: DateSuggestion) {
  return defineAction({
    name: (ctx) => (ctx.isContextual ? suggestion.text : `Snooze until "${suggestion.text}"`),
    icon: <IconClock />,
    group: currentNotificationActionsGroup,
    supplementaryLabel: () => niceFormatDateTime(suggestion.date),
    handler(context) {
      const notification = context.getTarget("notification");
      let group = context.getTarget("group");

      const date = suggestion.date;

      focusNextItemIfAvailable(context);

      const cancel = createCleanupObject("from-last");

      if (!group && notification) {
        // If the given notification is part of a group which can be previewed through a single notification, we treat
        // marking one of them as snoozed, as marking the whole group as snoozed
        group =
          groupNotifications(getDb().notification.find({ isSnoozed: false, isResolved: false }))
            .filter(getIsNotificationsGroup)
            .find(
              (group) => group.isOnePreviewEnough && group.notifications.some(({ id }) => notification.id === id)
            ) ?? null;
      }

      if (notification) {
        cancel.next = notification.snooze(date)?.undo;
      }

      if (group) {
        group.notifications.forEach((notification) => {
          cancel.next = notification.snooze(date)?.undo;
        });
      }

      displayZenModeIfFinished(context);

      addToast({
        message: pluralize`${cancel.size} ${["notification"]} snoozed`,
        action: {
          label: "Undo",
          callback() {
            cancel.clean();
          },
        },
      });
    },
  });
}
