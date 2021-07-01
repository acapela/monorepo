import { format } from "date-fns";

// TODO: Add relative time format '3 days ago'.
// const SECOND = 1000;
// const MINUTE = SECOND * 60;
// const HOUR = MINUTE * 60;
// const DAY = HOUR * 24;

// const JUST_NOW_OFFSET = MINUTE;

// type VisualDateFormat = [label: string, tooltip: string];

export function niceFormatDate(date: Date): string {
  return format(date, "MMM do");
}

export function niceFormatDateTime(date: Date): string {
  return format(date, "MMM do") + " at " + niceFormatTime(date);
}

export function niceFormatTime(date: Date): string {
  return format(date, "p");
}

export function getWeekdayName(date: Date): string {
  return format(date, "EEEE");
}
