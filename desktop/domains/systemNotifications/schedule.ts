import { addDays, isAfter, isBefore } from "date-fns";

import { assert } from "@aca/shared/assert";
import { floorNumberByInterval } from "@aca/shared/numbers";

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

function getNextDateAfterByIntervalFromStart(startDate: Date, afterDate: Date, intervalMs: number) {
  const startTs = startDate.getTime();
  const afterTs = afterDate.getTime();

  const differenceMs = afterTs - startTs;

  assert(differenceMs >= 0, "getNextDateAfterByIntervalFromStart");

  const nextDateTs = startTs + floorNumberByInterval(differenceMs, intervalMs) + intervalMs;

  return new Date(nextDateTs);
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

  const nextDateByInterval = getNextDateAfterByIntervalFromStart(dayStart, referenceDate, intervalInMs);

  if (isAfter(nextDateByInterval, dayEnd)) {
    return nextDayStart;
  }

  return nextDateByInterval;
}
