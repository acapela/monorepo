import { entries } from "lodash";
import { isPrimitive } from "utility-types";

import { isNullish } from "../nullish";

export type FiltersData<T> = {
  [Key in keyof T]?: FilterValue<T[Key]>;
};

export type FilterValue<T> = T | { $in: T[] } | { $not: T };

export function getFilterValueAllowedValues<T>(filterValue: FilterValue<T>): T[] {
  if (isNullish(filterValue)) {
    return [];
  }

  if ("$not" in filterValue) {
    return [];
  }

  if ("$in" in filterValue) {
    return filterValue.$in;
  }

  return [filterValue];
}

export function getIsItemMatchingFilters<T extends object>(item: T, filters: FiltersData<T>): boolean {
  const filterEntries = entries(filters);

  if (filterEntries.length === 0) return true;

  return filterEntries.every(([key, filter]) => {
    const itemValue = Reflect.get(item, key);

    return getIsValueMatchingFilter(filter, itemValue);
  });
}

export function getIsItemMatchingAnyOfFilters<T extends object>(item: T, filters: FiltersData<T>[]): boolean {
  return filters.some((filter) => getIsItemMatchingFilters(item, filter));
}

export function getIsValueMatchingFilter<T>(filter: FilterValue<T>, value: T) {
  if (!filter) {
    return filter === value;
  }

  if (isPrimitive(filter)) {
    return filter === value;
  }

  if ("$in" in filter) {
    return filter.$in.includes(value);
  }

  if ("$not" in filter) {
    return value !== filter.$not;
  }

  return filter === value;
}
