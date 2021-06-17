import { startOfDay, endOfDay } from "date-fns";

export function getDayBoundaries(date: Date) {
  return [startOfDay(date), endOfDay(date)] as const;
}
