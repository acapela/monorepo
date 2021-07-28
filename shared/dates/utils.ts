import { startOfDay, endOfDay } from "date-fns";
import { sortBy } from "lodash";

export function getDayBoundaries(date: Date) {
  return [startOfDay(date), endOfDay(date)] as const;
}

type SortByDateOrder = "newer-first" | "older-first";

export function sortByDate<T>(input: T[], dateGetter: (item: T) => Date, order: SortByDateOrder = "newer-first"): T[] {
  return sortBy(input, (item) => {
    const date = dateGetter(item);

    if (order === "newer-first") {
      return -date.getTime();
    }

    return date.getTime();
  });
}
