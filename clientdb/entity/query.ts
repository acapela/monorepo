import { sortBy } from "lodash";
import { IObservableArray } from "mobx";

import { createReuseValueGroup } from "@aca/shared/createEqualReuser";
import { createDeepMap } from "@aca/shared/deepMap";

import { EntityDefinition } from "./definition";
import { Entity } from "./entity";
import { IndexQueryInput } from "./queryIndex";
import { EntityStore } from "./store";
import { cachedComputed } from "./utils/cachedComputed";
import { cachedComputedWithoutArgs } from "./utils/cachedComputedWithoutArgs";

export type EntityFilterFunction<Data, Connections> = (item: Entity<Data, Connections>) => boolean;

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
  name?: string;
};

export type EntityFilterInputByDefinition<Def> = Def extends EntityDefinition<infer D, infer C>
  ? EntityFilterInput<D, C>
  : never;

export type EntityQueryByDefinition<Def> = Def extends EntityDefinition<infer D, infer C> ? EntityQuery<D, C> : never;

export function resolveSortInput<Data, Connections>(
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
  sort(sort: EntityQuerySortFunction<Data, Connections>): EntityQuery<Data, Connections>;
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
  const {
    filter,
    sort = definition.config.defaultSort as EntityQuerySortFunction<Data, Connections>,
    name: queryName,
  } = config;

  const {
    config: { functionalFilterCheck },
  } = definition;

  if (!filter && !sort) {
    throw new Error(
      `Either filter or sort is needed to be provided to query. If no sort or filter is needed, use .all property.`
    );
  }

  const sortConfig = resolveSortInput(sort);

  function getQueryKeyBase() {
    const parts: string[] = [definition.config.name];

    if (queryName) {
      parts.push(queryName);
    }

    if (filter) {
      if (typeof filter === "function") {
        parts.push(`filter()`);
      } else {
        parts.push(`filter({${Object.keys(filter).join(",")}})`);
      }
    }

    if (sortConfig) {
      parts.push(`sort()[${sortConfig.direction}]`);
    }

    return parts.join("__");
  }

  const queryKeyBase = getQueryKeyBase();

  /**
   * Create filter cache only for functional filter.
   *
   * Simple query filter eg { user_id: "foo" } does not require it as simpleQuery is already cached
   * and observable.
   *
   * Also it is very often used resulting easily in 100k+ calls on production data (we really dont want so many cached functions
   * created for already cached list)
   */
  const cachedFilterForFunctionalFilter =
    typeof filter === "function"
      ? /**
         * Important! Do not do cachedComputed(filter) - it might look the same, but native .filter function of
         * array is using 3 arguments (item, index, array), not one. In such case cache would be created for all of those arguments.
         */
        cachedComputed((item: Entity<Data, Connections>) => {
          if (functionalFilterCheck) {
            functionalFilterCheck(item, filter);
          }

          return filter(item);
        })
      : null;

  // Note: this value will be cached as long as it is in use and nothing it uses changes.
  // TLDR: query value is cached between renders if no items it used changed.
  const passingItems = cachedComputedWithoutArgs(
    () => {
      let items = getSource();

      if (!items.length) {
        return items;
      }

      /**
       * Important!
       *
       * Do not create 'cachedComputed' of (item: Entity) => boolean to filter those here.
       *
       * This can easily create 100k+ computed as it would be created by any combination of queries.
       */
      if (cachedFilterForFunctionalFilter) {
        items = items.filter((item) => cachedFilterForFunctionalFilter(item));
      }

      if (filter && typeof filter !== "function") {
        const storeMatchingItems = store.find(filter);

        items = items.filter((passingItem) => storeMatchingItems.includes(passingItem));
      }

      if (sortConfig) {
        items = sortBy(items, sortConfig.sort);

        if (sortConfig?.direction === "desc") {
          return items;
        }

        return items.reverse();
      }

      return items;
    },
    { name: `${queryKeyBase}.passingItems` }
  );

  const hasItemsComputed = cachedComputedWithoutArgs(
    () => {
      return passingItems.get().length > 0;
    },
    { name: `${queryKeyBase}.hasItems` }
  );

  function getAll() {
    return passingItems.get();
  }

  const countComputed = cachedComputedWithoutArgs(() => getAll().length, { name: `${queryKeyBase}.count` });
  const firstComputed = cachedComputedWithoutArgs(() => getAll()[0] ?? null, { name: `${queryKeyBase}.first` });
  const lastComputed = cachedComputedWithoutArgs(
    () => {
      const all = getAll();

      return all[all.length - 1] ?? null;
    },
    { name: `${queryKeyBase}.last` }
  );

  const byIdMapComputed = cachedComputedWithoutArgs(
    () => {
      const all = getAll();

      const record: Record<string, Entity<Data, Connections>> = {};

      for (const item of all) {
        record[item.getKey()] = item;
      }

      return record;
    },
    { name: `${queryKeyBase}.idMap` }
  );

  const getById = cachedComputed(
    function getById(id: string) {
      return byIdMapComputed.get()[id] ?? null;
    },
    { name: `${queryKeyBase}.getById` }
  );

  const reuseQueriesMap = createDeepMap<EntityQuery<Data, Connections>>();

  function createOrReuseQuery(
    filter?: EntityFilterInput<Data, Connections>,
    sort?: EntityQuerySortInput<Data, Connections>
  ) {
    const resolvedSort = resolveSortInput(sort) ?? undefined;
    const query = reuseQueriesMap.get([reuseQueryFilter(filter), reuseQuerySort(resolvedSort)], () => {
      const query = createEntityQuery(() => passingItems.get(), { filter, sort: resolvedSort }, store);

      return query;
    });

    return query;
  }

  return {
    get hasItems() {
      return hasItemsComputed.get();
    },
    get count() {
      return countComputed.get();
    },
    get all() {
      return getAll();
    },
    get first() {
      return firstComputed.get();
    },
    get last() {
      return lastComputed.get();
    },
    findById(id) {
      return getById(id);
    },
    query(filter, sort) {
      return createOrReuseQuery(filter, sort);
    },
    sort(sort) {
      return createOrReuseQuery(undefined, sort);
    },
  };
}

export const reuseQueryFilter = createReuseValueGroup();
export const reuseQuerySort = createReuseValueGroup();
