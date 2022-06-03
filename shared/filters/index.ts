import { entries } from "lodash";
import { isPrimitive } from "utility-types";

export type FiltersData<T> = {
  [Key in keyof T]?: FilterValue<T[Key]>;
};

export type FiltersInput<T> = FiltersData<T> & {
  $or?: FiltersInput<T>[];
};

export type FilterValue<T> = T | { $in: T[] } | { $not: T } | { $notIn: T[] };

export function getIsItemMatchingFiltersData<T extends object>(item: T, filters: FiltersData<T>): boolean {
  const filterEntries = entries(filters);

  if (filterEntries.length === 0) return true;

  return filterEntries.every(([key, filter]) => {
    const itemValue = Reflect.get(item, key);

    const isMatching = getIsValueMatchingFilter(filter, itemValue);

    return isMatching;
  });
}

export function getIsItemMatchingFilters<T extends object>(item: T, filters: FiltersInput<T>, debug = false): boolean {
  const { $or, ...filtersData } = filters;

  if (debug) {
    // debugger;
  }

  if (!getIsItemMatchingFiltersData(item, filtersData as FiltersData<T>)) {
    return false;
  }

  if (!$or) return true;

  return $or.some((filterData) => {
    const { $or: $nestedOr, ...orFiterData } = filterData;
    const isMatchingDirectly = getIsItemMatchingFiltersData(item, orFiterData as FiltersData<T>);

    if (!isMatchingDirectly) return false;

    if (!$nestedOr) {
      return true;
    }

    return getIsItemMatchingFilters(item, orFiterData as FiltersInput<T>);
  });
}

export function getIsItemMatchingAnyOfFilters<T extends object>(item: T, filters: FiltersInput<T>[]): boolean {
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

  if ("$notIn" in filter) {
    return !filter.$notIn.includes(value);
  }

  if ("$not" in filter) {
    return value !== filter.$not;
  }

  return filter === value;
}
