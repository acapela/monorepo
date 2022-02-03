import { nextMonday, setDay, setHours, startOfTomorrow } from "date-fns";
import React from "react";

import { DateSuggestion, autosuggestDate } from "@aca/shared/dates/autocomplete/suggestions";
import { niceFormatDateTime } from "@aca/shared/dates/format";
import { IconClockCross, IconClockZzz } from "@aca/ui/icons";

import { defineAction } from "./action";
import { ActionContext } from "./action/context";
import { currentNotificationActionsGroup } from "./groups";
import { goToOrFocusNextItem } from "./views/common";

export const snoozeNotification = defineAction({
  group: currentNotificationActionsGroup,
  name: (ctx) => {
    if (ctx.hasTarget("group")) {
      return ctx.isContextual ? "Snooze all" : "Snooze all notifications in group...";
    }
    return ctx.isContextual ? "Snooze" : "Snooze notification...";
  },
  supplementaryLabel: (ctx) => ctx.getTarget("group")?.name ?? undefined,
  keywords: ["delay", "time", "next", "tomorrow", "week", "in"],
  canApply: (ctx) => {
    if (ctx.getTarget("notification")?.canSnooze === true) return true;
    if (ctx.getTarget("group")?.notifications.some((notification) => notification.canSnooze) === true) return true;

    return false;
  },
  icon: <IconClockZzz />,
  shortcut: ["Mod", "W"],
  handler() {
    return {
      searchPlaceholder: "In 3 days...",
      getActions: (context) => {
        const dateSuggestions = getSnoozeSuggestions(context);

        const snoozeActions = dateSuggestions.map(convertDateSuggestionToAction);

        return snoozeActions;
      },
    };
  },
});

export const unsnoozeNotification = defineAction({
  group: currentNotificationActionsGroup,
  name: "Cancel snooze",
  supplementaryLabel: (ctx) => ctx.getTarget("group")?.name ?? undefined,
  keywords: ["now", "remove", "schedule", "do", "unsnooze", "undo"],
  canApply: (ctx) => {
    if (ctx.getTarget("notification")?.isSnoozed === true) return true;
    if (ctx.getTarget("group")?.notifications.some((n) => n.isSnoozed) === true) return true;

    return false;
  },
  icon: <IconClockCross />,
  shortcut: ["Mod", "W"],
  handler(ctx) {
    ctx.getTarget("notification")?.update({ snoozed_until: null });
    ctx.getTarget("group")?.notifications.forEach((notification) => {
      notification.update({ snoozed_until: null });
    });
  },
});

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

function getSnoozeSuggestions({ searchKeyword }: ActionContext): DateSuggestion[] {
  if (!searchKeyword.trim()) return defaultSuggestions;

  return autosuggestDate(searchKeyword).map((suggestion) => {
    if (suggestion.isExact) return suggestion;
    return {
      ...suggestion,
      date: setHours(suggestion.date, DEFAULT_WORK_START_HOUR),
    };
  });
}

function convertDateSuggestionToAction(suggestion: DateSuggestion) {
  return defineAction({
    name: suggestion.text,
    icon: <IconClockZzz />,
    supplementaryLabel: () => niceFormatDateTime(suggestion.date),
    handler(context) {
      const notification = context.getTarget("notification");
      const group = context.getTarget("group");

      const dateISO = suggestion.date.toISOString();

      goToOrFocusNextItem(context);

      if (notification) {
        notification.update({ snoozed_until: dateISO });
      }

      if (group) {
        group.notifications.forEach((notification) => {
          notification.update({ snoozed_until: dateISO });
        });
      }
    },
  });
}
