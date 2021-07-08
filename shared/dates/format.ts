import { format, formatRelative, startOfWeek, compareAsc } from "date-fns";
import { upperFirst } from "lodash";

export function relativeFormatDate(date: Date): string {
  if (isBeforeThisWeek(date)) {
    return niceFormatDateTime(date);
  }
  // "Today"/"Yesterday" instead of "today"/ "yesterday"
  return upperFirst(formatRelative(date, new Date()));
}

interface DateFormatOptions {
  showWeekDay?: "long" | "short";
}
function getWeekDayFormat(options?: DateFormatOptions) {
  if (!options || !options.showWeekDay) return "";

  if (options.showWeekDay === "long") {
    return "EEEE, ";
  }

  return "EEE ";
}

export function niceFormatDate(date: Date, options?: DateFormatOptions): string {
  return format(date, `${getWeekDayFormat(options)}MMM do`);
}

export function niceFormatDateTime(date: Date, options?: DateFormatOptions): string {
  return format(date, `${getWeekDayFormat(options)}MMM do`) + " at " + niceFormatTime(date);
}

export function niceFormatTime(date: Date): string {
  return format(date, "p");
}

export function getWeekdayName(date: Date): string {
  return format(date, "EEEE");
}

function isBeforeThisWeek(date: Date): boolean {
  const startOfThisWeek = startOfWeek(new Date());
  // 1 if the first date is after the second
  // -1 if the first date is before the second
  // 0 if dates are equal.
  return compareAsc(date, startOfThisWeek) === -1;
}
