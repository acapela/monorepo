import { nextMonday, setDay, setHours, startOfTomorrow } from "date-fns";
import React from "react";

import { DateSuggestion, autosuggestDate } from "@aca/shared/dates/autocomplete/suggestions";
import { niceFormatDateTime } from "@aca/shared/dates/format";
import { IconBell } from "@aca/ui/icons";

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

type ReminderActionCallback = (date: Date, context: ActionContext) => void;

export function getReminderSuggestionActions(context: ActionContext, callback: ReminderActionCallback) {
  const dateSuggestions = getReminderSuggestions(context);

  const addReminderActions = dateSuggestions.map((suggestion) => convertDateSuggestionToAction(suggestion, callback));

  return addReminderActions;
}

function getReminderSuggestions({ searchKeyword, isContextual }: ActionContext): DateSuggestion[] {
  if (!searchKeyword.trim()) return defaultSuggestions;

  return autosuggestDate(searchKeyword, { maxResults: isContextual ? 5 : 2 }).map((suggestion) => {
    if (suggestion.isExact) return suggestion;
    return {
      ...suggestion,
      date: setHours(suggestion.date, DEFAULT_WORK_START_HOUR),
    };
  });
}

function convertDateSuggestionToAction(suggestion: DateSuggestion, callback: ReminderActionCallback) {
  return defineAction({
    name: (ctx) => (ctx.isContextual ? suggestion.text : `Add reminder: "${suggestion.text}"`),
    icon: <IconBell />,
    supplementaryLabel: () => niceFormatDateTime(suggestion.date),
    handler(context) {
      const date = suggestion.date;

      callback(date, context);
    },
  });
}

export async function pickReminderTime() {
  return new Promise<Date>((resolve) => {
    const action = createPickReminderAction((date) => {
      resolve(date);
    });

    runAction(action, createActionContext());
  });
}

function createPickReminderAction(callback: ReminderActionCallback) {
  const addReminder = defineAction({
    name: "Add reminder",
    supplementaryLabel: (ctx) => ctx.getTarget("group")?.getMeta().title ?? undefined,
    icon: <IconBell />,
    handler() {
      return {
        searchPlaceholder: "In 3 days...",
        isContextual: true,
        getActions: (context) => {
          return getReminderSuggestionActions(context, callback);
        },
      };
    },
  });

  return addReminder;
}
