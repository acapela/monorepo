import { memoize, sortBy } from "lodash";
import { IObservableArray, computed } from "mobx";

import { EntityDefinition } from "./definition";
import { Entity } from "./entity";

type EntityQueryFilter<Data> = (item: Data) => boolean;

export type SortResult = string | number | boolean | Date | null | void | undefined;

type EntityQueryResolvedConfig<Data> = {
  filter?: EntityQueryFilter<Data>;
  sort?: (item: Data) => SortResult;
};

export type EntityQueryConfig<Data, Connections> = EntityQueryFilter<Data> | EntityQueryResolvedConfig<Data>;

function resolveEntityQueryConfig<Data, Connections>(
  config: EntityQueryConfig<Data, Connections>
): EntityQueryResolvedConfig<Data> {
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

export function createEntityQuery<Data, Connections>(
  source: MaybeObservableArray<Entity<Data, Connections>>,
  config: EntityQueryConfig<Data, Connections>,
  definition: EntityDefinition<Data, Connections>
): EntityQuery<Data, Connections> {
  const { filter, sort = definition.config.defaultSort } = resolveEntityQueryConfig(config);

  const memoizedFilter = memoize(filter ?? truePredicate);
  const memoizedSort = sort ? memoize(sort) : null;

  const passingItems = computed(() => {
    const passedItems = source.filter(memoizedFilter);

    if (memoizedSort) {
      return sortBy(passedItems, memoizedSort);
    }

    return passedItems;
  });

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
