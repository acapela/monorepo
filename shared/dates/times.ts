import { isFriday, nextMonday, setHours, startOfToday, startOfTomorrow } from "date-fns";

export const DEFAULT_END_OF_WORK_DAY = 18;

export function getTodayEndOfDay(currentUserEndOfWorkDay: number): Date {
  return setHours(startOfToday(), currentUserEndOfWorkDay);
}

export function getNextWorkDayEndOfDay(currentUserEndOfWorkDay: number): Date {
  const today = startOfToday();
  const nextWorkDay = isFriday(today) ? nextMonday(today) : startOfTomorrow();

  return setHours(nextWorkDay, currentUserEndOfWorkDay);
}
