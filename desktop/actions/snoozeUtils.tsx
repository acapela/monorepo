import { nextMonday, setDay, setHours, startOfTomorrow } from "date-fns";
import React from "react";

import { DateSuggestion, autosuggestDate } from "@aca/shared/dates/autocomplete/suggestions";
import { niceFormatDateTime } from "@aca/shared/dates/format";
import { IconClock } from "@aca/ui/icons";

import { runAction } from "../domains/runAction";
import { defineAction } from "./action";
import { ActionContext, createActionContext } from "./action/context";

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

type SnoozeActionCallback = (date: Date, context: ActionContext) => void;

export function getSnoozeSuggestionActions(context: ActionContext, callback: SnoozeActionCallback) {
  const dateSuggestions = getSnoozeSuggestions(context);

  const snoozeActions = dateSuggestions.map((suggestion) => convertDateSuggestionToAction(suggestion, callback));

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

function convertDateSuggestionToAction(suggestion: DateSuggestion, callback: SnoozeActionCallback) {
  return defineAction({
    name: (ctx) => (ctx.isContextual ? suggestion.text : `Snooze until "${suggestion.text}"`),
    icon: <IconClock />,
    supplementaryLabel: () => niceFormatDateTime(suggestion.date),
    handler(context) {
      const date = suggestion.date;

      callback(date, context);
    },
  });
}

export async function pickSnoozeTime() {
  return new Promise<Date>((resolve) => {
    const action = createPickSnoozeAction((date) => {
      resolve(date);
    });

    runAction(action, createActionContext());
  });
}

function createPickSnoozeAction(callback: SnoozeActionCallback) {
  const snoozeNotification = defineAction({
    name: "Snooze",
    supplementaryLabel: (ctx) => ctx.getTarget("group")?.name ?? undefined,
    icon: <IconClock />,
    handler() {
      return {
        searchPlaceholder: "In 3 days...",
        isContextual: true,
        getActions: (context) => {
          return getSnoozeSuggestionActions(context, callback);
        },
      };
    },
  });

  return snoozeNotification;
}
