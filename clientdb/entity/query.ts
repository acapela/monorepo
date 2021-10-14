import { sortBy } from "lodash";
import { IObservableArray, computed } from "mobx";

import { typedKeys } from "~shared/object";

import { Entity } from "./entity";
import { EntitySimpleQuery, EntityStore } from "./store";
import { computedArray } from "./utils/computedArray";
import { createEntityCache } from "./utils/entityCache";

type EntityFunctionQuery<Data, Connections> = (item: Entity<Data, Connections>) => boolean;

type EntityQueryFilter<Data, Connections> = EntitySimpleQuery<Data> | EntityFunctionQuery<Data, Connections>;
type EntityQuerySorter<Data, Connections> = (item: Entity<Data, Connections>) => SortResult;

export type SortResult = string | number | boolean | Date | null | void | undefined;

type EntityQueryResolvedConfig<Data, Connections> = {
  filter?: EntityQueryFilter<Data, Connections>;
  sort?: EntityQuerySorter<Data, Connections>;
};

export type EntityQueryConfig<Data, Connections> =
  | EntityQueryFilter<Data, Connections>
  | EntityQueryResolvedConfig<Data, Connections>;

function isPlainFilter<Data, Connections>(
  filter: EntitySimpleQuery<Data> | EntityQueryResolvedConfig<Data, Connections>,
  store: EntityStore<Data, Connections>
): filter is EntitySimpleQuery<Data> {
  return typedKeys(filter).every((configKey) => {
    return store.definition.config.keys.includes(configKey);
  });
}

function resolveEntityQueryConfig<Data, Connections>(
  config: EntityQueryConfig<Data, Connections>,
  store: EntityStore<Data, Connections>
): EntityQueryResolvedConfig<Data, Connections> {
  if (typeof config === "function") {
    return {
      filter: config,
    };
  }

  if (isPlainFilter(config, store)) {
    return { filter: config };
  }

  return config;
}

type MaybeObservableArray<T> = IObservableArray<T> | T[];

export type EntityQuery<Data, Connections> = {
  all: Entity<Data, Connections>[];
  first: Entity<Data, Connections> | null;
  last: Entity<Data, Connections> | null;
  hasItems: boolean;
  count: number;

  findById(id: string): Entity<Data, Connections> | null;
  query: (config: EntityQueryConfig<Data, Connections>) => EntityQuery<Data, Connections>;
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
  const { filter, sort = definition.config.defaultSort as EntityQuerySorter<Data, Connections> } =
    resolveEntityQueryConfig(config, store);

  function isEntityPassingFilter(item: Entity<Data, Connections>) {
    if (!filter) return true;

    if (typeof filter === "function") {
      return filter(item);
    }

    return store.simpleQuery(filter).includes(item);
  }

  const cachedFilter = createEntityCache(isEntityPassingFilter);
  const cachedSort = sort ? createEntityCache(sort) : null;

  // Note: this value will be cached as long as it is in use and nothing it uses changes.
  // TLDR: query value is cached between renders if no items it used changed.
  const passingItems = computedArray(
    () => {
      const passedItems = getSource().filter(cachedFilter);

      if (cachedSort) {
        return sortBy(passedItems, cachedSort);
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
    query(config) {
      return createEntityQuery(() => passingItems.get(), config, store);
    },
  };
}
