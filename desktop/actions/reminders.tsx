import { isSameDay, nextMonday, setDay, setHours, startOfTomorrow } from "date-fns";
import { addHours } from "date-fns/esm";
import React from "react";

import { DateSuggestion, autosuggestDate } from "@aca/shared/dates/autocomplete/suggestions";
import { niceFormatDateTime } from "@aca/shared/dates/format";
import { pluralize } from "@aca/shared/text/pluralize";
import { IconBell } from "@aca/ui/icons";

import { addToast } from "../domains/toasts/store";
import { defineAction } from "./action";
import { ActionContext } from "./action/context";
import { currentNotificationActionsGroup } from "./groups";
import { runForEachTargettedNotification } from "./utils";
import { displayZenModeIfFinished, focusNextItemIfAvailable } from "./views/common";

export function getIsTargetNotificationOrGroup(context: ActionContext) {
  if (context.getTarget("notification")) return true;
  if (context.getTarget("group")) return true;

  return false;
}

export function getReminderOptionsForSearch(context: ActionContext) {
  if (!getIsTargetNotificationOrGroup(context)) return [];

  return getReminderSuggestionActions(context);
}

const DEFAULT_WORK_START_HOUR = 9;
const DEFAULT_WORK_END_HOUR = 17;

function setHoursAndResetMinutes(date: Date, hours: number) {
  const hourDate = setHours(date, hours);
  hourDate.setMinutes(0, 0, 0);

  return hourDate;
}

const defaultSuggestions: DateSuggestion[] = [
  {
    text: "In 2 hours",
    get date() {
      return addHours(new Date(), 2);
    },
  },
  {
    text: "End of day",
    get date() {
      return setHoursAndResetMinutes(new Date(), DEFAULT_WORK_END_HOUR);
    },
  },
  {
    text: "Tomorrow",
    get date() {
      return setHoursAndResetMinutes(startOfTomorrow(), DEFAULT_WORK_START_HOUR);
    },
  },
  {
    text: "End of week",
    get date() {
      return setHoursAndResetMinutes(setDay(new Date(), 5), DEFAULT_WORK_START_HOUR);
    },
  },
  {
    text: "Next week",
    get date() {
      return setHoursAndResetMinutes(nextMonday(new Date()), DEFAULT_WORK_START_HOUR);
    },
  },
];

export function getReminderSuggestionActions(context: ActionContext) {
  const dateSuggestions = getReminderSuggestions(context);

  const reminderActions = dateSuggestions.map(convertDateSuggestionToAction);

  return reminderActions;
}

function convertDateToStartOfDay(date: Date) {
  const clonedDate = new Date(date);
  clonedDate.setHours(DEFAULT_WORK_START_HOUR, 0, 0, 0);
  return clonedDate;
}

function prepareSuggestionTime(date: Date, now = new Date()) {
  if (isSameDay(date, now)) {
    return date;
  }

  return convertDateToStartOfDay(date);
}

function getReminderSuggestions({ searchKeyword, isContextual }: ActionContext): DateSuggestion[] {
  if (!searchKeyword.trim()) return defaultSuggestions;

  const now = new Date();

  return autosuggestDate(searchKeyword, { maxResults: isContextual ? 5 : 2 }).map((suggestion) => {
    if (suggestion.isExact) return suggestion;
    return {
      ...suggestion,
      date: prepareSuggestionTime(suggestion.date, now),
    };
  });
}

function convertDateSuggestionToAction(suggestion: DateSuggestion) {
  return defineAction({
    name: (ctx) => (ctx.isContextual ? suggestion.text : `Remind me: "${suggestion.text}"`),
    icon: <IconBell />,
    group: currentNotificationActionsGroup,
    supplementaryLabel: () => niceFormatDateTime(suggestion.date),
    handler(context) {
      const date = suggestion.date;

      focusNextItemIfAvailable(context);

      const { operationsCount, undo } = runForEachTargettedNotification(context, (notification) => {
        return notification.addReminder(date)?.undo;
      });

      displayZenModeIfFinished(context);

      addToast({
        message: pluralize`Added reminder to ${operationsCount} ${["notification"]}`,
        action: {
          label: "Undo",
          callback() {
            undo();
          },
        },
      });
    },
  });
}
