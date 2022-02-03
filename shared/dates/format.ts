import {
  compareAsc,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  formatRelative,
  isThisYear,
  startOfWeek,
} from "date-fns";
import { upperFirst } from "lodash";

import { timeDuration } from "../time";

export function relativeFormatDate(date: Date): string {
  if (isBeforeThisWeek(date)) {
    return niceFormatDate(date);
  }
  // "Today"/"Yesterday" instead of "today"/ "yesterday"
  const relativeDateWithTime = upperFirst(formatRelative(date, new Date()));

  // TODO: This is very naive method of removing the time. date-fns currently does not support relative date-only format
  return relativeDateWithTime.replace(/ at .*/, "");
}

export function relativeFormatDateTime(date: Date): string {
  if (isBeforeThisWeek(date)) {
    return niceFormatDateTime(date);
  }
  // "Today"/"Yesterday" instead of "today"/ "yesterday"
  return upperFirst(formatRelative(date, new Date()));
}

export function niceFormatDate(date: Date, options?: FormatOptions): string {
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    weekday: "short",
    year: isThisYear(date) ? undefined : "numeric",
    ...options,
  });
}

type FormatOptions = Intl.DateTimeFormatOptions;

export function niceFormatDateTime(date: Date, options?: FormatOptions): string {
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    weekday: "short",
    year: isThisYear(date) ? undefined : "numeric",
    hour: "numeric",
    minute: "numeric",
    ...options,
  });
}

export function niceFormatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, { timeStyle: "short" });
}

function isBeforeThisWeek(date: Date): boolean {
  const startOfThisWeek = startOfWeek(new Date());
  // 1 if the first date is after the second
  // -1 if the first date is before the second
  // 0 if dates are equal.
  return compareAsc(date, startOfThisWeek) === -1;
}

export function niceFormatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const minutesLeft = minutes % 60;
  return `${hours}h${minutesLeft}m`;
}

export function relativeShortFormatDate(date: Date): string {
  const now = new Date();
  const timeSinceNow = now.getTime() - date.getTime();

  if (timeSinceNow <= timeDuration.hour) {
    return `${differenceInMinutes(now, date)}m`;
  }

  if (timeSinceNow <= timeDuration.day) {
    return `${differenceInHours(now, date)}h`;
  }

  return `${differenceInDays(now, date)}d`;
}
