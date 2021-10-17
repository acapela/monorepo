import { sortBy } from "lodash";
import { IObservableArray, computed } from "mobx";

import { Entity } from "./entity";
import { IndexQueryInput } from "./queryIndex";
import { EntityStore } from "./store";
import { computedArray } from "./utils/computedArray";
import { createEntityCache } from "./utils/entityCache";

type EntityFilterFunction<Data, Connections> = (item: Entity<Data, Connections>) => boolean;

export type EntityQuerySortFunction<Data, Connections> = (item: Entity<Data, Connections>) => SortResult;

export type EntitySortDirection = "asc" | "desc";

type EntityQuerySortConfig<Data, Connections> = {
  sort: EntityQuerySortFunction<Data, Connections>;
  direction: "asc" | "desc";
};

export type EntityQuerySortInput<Data, Connections> =
  | EntityQuerySortFunction<Data, Connections>
  | EntityQuerySortConfig<Data, Connections>;

export type SortResult = string | number | boolean | Date | null | void | undefined;

export type EntityFilterInput<Data, Connections> =
  | EntityFilterFunction<Data, Connections>
  | IndexQueryInput<Data & Connections>;

export type EntityQueryConfig<Data, Connections> = {
  filter?: EntityFilterInput<Data, Connections>;
  sort?: EntityQuerySortInput<Data, Connections>;
};

function resolveSortInput<Data, Connections>(
  sort?: EntityQuerySortInput<Data, Connections>
): EntityQuerySortConfig<Data, Connections> | null {
  if (!sort) return null;

  if (typeof sort === "function") {
    return { sort, direction: "desc" };
  }

  return sort;
}

type MaybeObservableArray<T> = IObservableArray<T> | T[];

export type EntityQuery<Data, Connections> = {
  all: Entity<Data, Connections>[];
  first: Entity<Data, Connections> | null;
  last: Entity<Data, Connections> | null;
  hasItems: boolean;
  count: number;

  findById(id: string): Entity<Data, Connections> | null;
  query: (
    filter: EntityFilterInput<Data, Connections>,
    sort?: EntityQuerySortFunction<Data, Connections>
  ) => EntityQuery<Data, Connections>;
};

/**
 * Query keeps track of all items passing given query filter and sorter.
 *
 * It will automatically update results if 'source list' changes.
 */
export function createEntityQuery<Data, Connections>(
  // Might be plain array or any observable array. This allows creating nested queries of previously created queries
  // It is getter as source value might be computed value, so we want to observe getting it (especially in nested queries)
  getSource: () => MaybeObservableArray<Entity<Data, Connections>>,
  config: EntityQueryConfig<Data, Connections>,
  store: EntityStore<Data, Connections>
): EntityQuery<Data, Connections> {
  const { definition } = store;
  const entityName = definition.config.name;
  const { filter, sort = definition.config.defaultSort as EntityQuerySortFunction<Data, Connections> } = config;

  if (!filter && !sort) {
    throw new Error(
      `Either filter or sort is needed to be provided to query. If no sort or filter is needed, use .all property.`
    );
  }

  const sortConfig = resolveSortInput(sort);

  function isEntityPassingFilter(item: Entity<Data, Connections>): boolean {
    if (!filter) return true;

    if (typeof filter === "function") return filter(item);

    return store.simpleQuery(filter).includes(item);
  }

  const cachedFilter = createEntityCache(isEntityPassingFilter);
  const cachedSortFunction = sortConfig ? createEntityCache(sortConfig.sort) : null;

  // Note: this value will be cached as long as it is in use and nothing it uses changes.
  // TLDR: query value is cached between renders if no items it used changed.
  const passingItems = computedArray(
    () => {
      const passedItems = getSource().filter(cachedFilter);

      if (cachedSortFunction) {
        const descSortedResults = sortBy(passedItems, cachedSortFunction);

        if (sortConfig?.direction === "desc") {
          return descSortedResults;
        }

        return descSortedResults.reverse();
      }

      return passedItems;
    },
    { name: `${entityName}QueryItems` }
  );

  const hasItemsComputed = computed(
    () => {
      return getSource().some(cachedFilter);
    },
    { name: `${entityName}HasItems` }
  );

  function getAll() {
    return passingItems.get();
  }

  return {
    get hasItems() {
      return hasItemsComputed.get();
    },
    get count() {
      return computed(() => getAll().length).get();
    },
    get all() {
      return getAll();
    },
    get first() {
      return computed(() => {
        const all = getAll();
        return all[0] ?? null;
      }).get();
    },
    get last() {
      return computed(() => {
        const all = getAll();
        return all[all.length - 1] ?? null;
      }).get();
    },
    findById(id) {
      return computed(
        () => {
          return passingItems.get().find((item) => item.getKey() === id) ?? null;
        },
        { name: `${entityName}FindById${id}` }
      ).get();
    },
    query(filter, sort) {
      return createEntityQuery(() => passingItems.get(), { filter, sort }, store);
    },
  };
}
