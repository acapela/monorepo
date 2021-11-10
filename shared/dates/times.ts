import { isFriday, nextMonday, setHours, startOfToday, startOfTomorrow } from "date-fns";

const END_OF_WORK_DAY = 17;

export function getTodayEndOfDay() {
  return setHours(startOfToday(), END_OF_WORK_DAY);
}

export function getNextWorkDayEndOfDay() {
  const today = startOfToday();
  const nextWorkDay = isFriday(today) ? nextMonday(today) : startOfTomorrow();

  return setHours(nextWorkDay, END_OF_WORK_DAY);
}
