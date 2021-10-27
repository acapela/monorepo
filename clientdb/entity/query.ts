import { sortBy } from "lodash";
import { IObservableArray, computed } from "mobx";

import { createEqualValueReuser } from "~shared/createEqualReuser";
import { createDeepMap } from "~shared/deepMap";

import { Entity } from "./entity";
import { IndexQueryInput } from "./queryIndex";
import { EntityStore } from "./store";
import { createEntityCache } from "./utils/entityCache";
import { lazyComputed } from "./utils/lazyComputed";
import { lazyComputedWithArgs } from "./utils/lazyComputedWithArgs";

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

  const cachedFilter = lazyComputedWithArgs(isEntityPassingFilter, {
    name: `${entityName}filter${JSON.stringify(filter)}`,
  });
  const cachedSortFunction = sortConfig ? lazyComputedWithArgs(sortConfig.sort, { name: `${entityName}sort` }) : null;

  // Note: this value will be cached as long as it is in use and nothing it uses changes.
  // TLDR: query value is cached between renders if no items it used changed.
  const passingItems = lazyComputed(
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

  const hasItemsComputed = lazyComputed(
    () => {
      return getSource().some(cachedFilter);
    },
    { name: `${entityName}HasItems` }
  );

  function getAll() {
    return passingItems.get();
  }

  const countComputed = lazyComputed(() => getAll().length, { name: `${entityName}QueryCount` });
  const firstComputed = lazyComputed(() => getAll()[0] ?? null, { name: `${entityName}firstComputed` });
  const lastComputed = lazyComputed(
    () => {
      const all = getAll();

      return all[all.length - 1] ?? null;
    },
    { name: `${entityName}lastComputed` }
  );

  const byIdMapComputed = lazyComputed(
    () => {
      const all = getAll();

      const record: Record<string, Entity<Data, Connections>> = {};

      for (const item of all) {
        record[item.getKey()] = item;
      }

      return record;
    },
    { name: `${entityName}byIdMapComputed` }
  );

  const getById = lazyComputedWithArgs(
    (id: string) => {
      return byIdMapComputed.get()[id] ?? null;
    },
    { name: `${entityName}getById` }
  );

  const reuseQueriesMap = createDeepMap<EntityQuery<Data, Connections>>();

  const reuseInput = createEqualValueReuser();

  function createOrReuseQuery(
    filter?: EntityFilterInput<Data, Connections>,
    sort?: EntityQuerySortInput<Data, Connections>
  ) {
    const resolvedSort = resolveSortInput(sort) ?? undefined;
    const query = reuseQueriesMap([reuseInput(filter), reuseInput(resolvedSort)], () => {
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
  };
}
