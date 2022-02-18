import { addDays, isAfter, isBefore } from "date-fns";
import { range } from "lodash";

type DayHourAndMinute = [hour: number, minute: number];

type DayTime = number | DayHourAndMinute;

function resolveDayTime(dayTime: DayTime, dayDate: Date): Date {
  const [hour, minute]: DayHourAndMinute = Array.isArray(dayTime) ? dayTime : [dayTime, 0];

  const dateClone = new Date(dayDate.getTime());

  dateClone.setHours(hour, minute, 0, 0);

  return dateClone;
}

interface GetNextScheduledDataInput {
  workStartHour: DayTime;
  workEndHour: DayTime;
  intervalInMs?: number;
}

function getBetweenDatesByInterval(start: Date, end: Date, intervalInMs: number) {
  return range(start.getTime(), end.getTime(), intervalInMs).map((stamp) => new Date(stamp));
}

export function getNextScheduledDate(
  { workStartHour, workEndHour, intervalInMs }: GetNextScheduledDataInput,
  referenceDate = new Date()
) {
  const dayStart = resolveDayTime(workStartHour, referenceDate);
  const dayEnd = resolveDayTime(workEndHour, referenceDate);

  const nextDayStart = resolveDayTime(workStartHour, addDays(referenceDate, 1));

  if (isAfter(referenceDate, dayEnd)) {
    return nextDayStart;
  }

  if (isBefore(referenceDate, dayStart)) {
    return dayStart;
  }

  if (!intervalInMs) {
    return nextDayStart;
  }

  const optimalDates = getBetweenDatesByInterval(dayStart, dayEnd, intervalInMs);

  const optimalDateToday = optimalDates.find((date) => isAfter(date, referenceDate))!;

  if (optimalDateToday) {
    return optimalDateToday;
  }

  return nextDayStart;
}
