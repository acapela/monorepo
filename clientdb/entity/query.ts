import { sortBy } from "lodash";
import { IObservableArray, computed } from "mobx";

import { EntityDefinition } from "./definition";
import { Entity } from "./entity";
import { createEntityCache } from "./utils/entityCache";

type EntityQueryFilter<Data, Connections> = (item: Entity<Data, Connections>) => boolean;
type EntityQuerySorter<Data, Connections> = (item: Entity<Data, Connections>) => SortResult;

export type SortResult = string | number | boolean | Date | null | void | undefined;

type EntityQueryResolvedConfig<Data, Connections> = {
  filter?: EntityQueryFilter<Data, Connections>;
  sort?: EntityQuerySorter<Data, Connections>;
};

export type EntityQueryConfig<Data, Connections> =
  | EntityQueryFilter<Data, Connections>
  | EntityQueryResolvedConfig<Data, Connections>;

function resolveEntityQueryConfig<Data, Connections>(
  config: EntityQueryConfig<Data, Connections>
): EntityQueryResolvedConfig<Data, Connections> {
  if (typeof config === "function") {
    return {
      filter: config,
    };
  }

  if (!config) {
    return { filter: truePredicate };
  }

  return config;
}

type MaybeObservableArray<T> = IObservableArray<T> | T[];

export type EntityQuery<Data, Connections> = {
  all: Entity<Data, Connections>[];
  findById(id: string): Entity<Data, Connections> | null;
  query: (config: EntityQueryConfig<Data, Connections>) => EntityQuery<Data, Connections>;
};

function truePredicate() {
  return true;
}

/**
 * Query keeps track of all items passing given query filter and sorter.
 *
 * It will automatically update results if 'source list' changes.
 */
export function createEntityQuery<Data, Connections>(
  // Might be plain array or any observable array. This allows creating nested queries of previously created queries
  source: MaybeObservableArray<Entity<Data, Connections>>,
  config: EntityQueryConfig<Data, Connections>,
  definition: EntityDefinition<Data, Connections>
): EntityQuery<Data, Connections> {
  const { filter, sort = definition.config.defaultSort as EntityQuerySorter<Data, Connections> } =
    resolveEntityQueryConfig(config);

  const cachedFilter = filter ? createEntityCache(filter) : null;
  const cachedSort = sort ? createEntityCache(sort) : null;

  const passingItems = computed(() => {
    const passedItems = cachedFilter ? source.filter(cachedFilter) : source.slice();

    if (cachedSort) {
      return sortBy(passedItems, cachedSort);
    }

    return passedItems;
  }, {});

  return {
    get all() {
      return passingItems.get();
    },
    findById(id) {
      return computed(() => {
        return passingItems.get().find((item) => item.getKey() === id) ?? null;
      }).get();
    },
    query(config) {
      return createEntityQuery(passingItems.get(), config, definition);
    },
  };
}
