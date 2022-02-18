import { entries, groupBy, round } from "lodash";

export interface BundledItem<T, R = T> {
  items: T[];
  bundled: R;
  date: Date;
}

export function bundleScheduledItems<T, R = T>(
  items: T[],
  dateGetter: (item: T) => Date,
  bundler: (closeTimeItems: T[], date: Date) => R,
  timeDistanceInMs = 0
): BundledItem<T, R>[] {
  const groups = groupBy(items, (item) => round(dateGetter(item).getTime(), timeDistanceInMs));

  const bundledItems = entries(groups).map(([timeStampString, items]): BundledItem<T, R> => {
    const date = new Date(parseInt(timeStampString, 10));

    const bundledItem = bundler(items, date);

    return { bundled: bundledItem, items, date };
  });

  return bundledItems;
}
