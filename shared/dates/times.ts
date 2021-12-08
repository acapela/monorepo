import { isFriday, nextMonday, setHours, startOfToday, startOfTomorrow } from "date-fns";

const DEFAULT_END_OF_WORK_DAY = 18; // setting default end of work day to 6pm

export function getTodayEndOfDay(currentUserEndOfWorkDay: number = DEFAULT_END_OF_WORK_DAY): Date {
  return setHours(startOfToday(), currentUserEndOfWorkDay);
}

export function getNextWorkDayEndOfDay(currentUserEndOfWorkDay: number = DEFAULT_END_OF_WORK_DAY): Date {
  const today = startOfToday();
  const nextWorkDay = isFriday(today) ? nextMonday(today) : startOfTomorrow();

  return setHours(nextWorkDay, currentUserEndOfWorkDay);
}
