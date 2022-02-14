import { entries } from "lodash";

export type FiltersData<T> = {
  [Key in keyof T]?: FilterValue<T[Key]>;
};

export type FilterValue<T> = T | { $in: T[] } | { $not: T };

export function getIsItemMatchingFilters<T extends object>(item: T, filters: FiltersData<T>): boolean {
  const filterEntries = entries(filters);

  if (filterEntries.length === 0) return true;

  return filterEntries.every(([key, filter]) => {
    const itemValue = Reflect.get(item, key);

    return getIsValueMatchingFilter(itemValue, filter);
  });
}

export function getIsItemMatchingAnyOfFilters<T extends object>(item: T, filters: FiltersData<T>[]): boolean {
  return filters.some((filter) => getIsItemMatchingFilters(item, filter));
}

function getIsValueMatchingFilter<T>(value: T, filter: FilterValue<T>) {
  if ("$in" in filter) {
    return filter.$in.includes(value);
  }

  if ("$not" in filter) {
    return value !== filter.$not;
  }

  return filter === value;
}
