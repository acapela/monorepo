import { IObservableArray, computed } from "mobx";

import { Entity } from "./entity";

type EntityQueryFilter<Data> = (item: Data) => boolean;

type SortResult = string | number | boolean | Date | null | void | undefined;

type EntityQueryResolvedConfig<Data> = {
  filter: EntityQueryFilter<Data>;
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
  query: (config: EntityQueryConfig<Data, Connections>) => EntityQuery<Data, Connections>;
};

function truePredicate() {
  return true;
}

export function createEntityQuery<Data, Connections>(
  source: MaybeObservableArray<Entity<Data, Connections>>,
  config: EntityQueryConfig<Data, Connections>
): EntityQuery<Data, Connections> {
  const { filter, sort } = resolveEntityQueryConfig(config);

  const passingItems = computed(() => {
    return source.filter(filter ?? truePredicate);
  });

  return {
    get all() {
      return passingItems.get();
    },
    query(config) {
      return createEntityQuery(passingItems.get(), config);
    },
  };
}
