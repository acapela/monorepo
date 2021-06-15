import { pluralize } from "~shared/numbers";
import { format } from "date-fns";

// const SECOND = 1000;
// const MINUTE = SECOND * 60;
// const HOUR = MINUTE * 60;
// const DAY = HOUR * 24;

// const JUST_NOW_OFFSET = MINUTE;

// type VisualDateFormat = [label: string, tooltip: string];

export function niceFormatDate(date: Date): string {
  return format(date, "MMM do at pp");
}

export function niceFormatTime(date: Date): string {
  return format(date, "p");
}
