import { computed, IObservableArray } from "mobx";

type EntityQueryFilter<Data> = (item: Data) => boolean;

type SortResult = number | string | Date | boolean | null | undefined;

type EntityQuerySorter<Data> = (item: Data) => SortResult;

type EntityQueryResolvedConfig<Data> = {
  filter?: EntityQueryFilter<Data>;
  sort?: EntityQuerySorter<Data>;
};

export type EntityQueryConfig<Data> = EntityQueryFilter<Data> | EntityQueryResolvedConfig<Data>;

function resolveEntityQueryConfig<Data>(config: EntityQueryConfig<Data>): EntityQueryResolvedConfig<Data> {
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

export type EntityQuery<Data> = {
  all: Data[];
  query: (config: EntityQueryConfig<Data>) => EntityQuery<Data>;
};

function truePredicate() {
  return true;
}

export function createEntityQuery<Data>(
  source: IObservableArray<Data> | Data[],
  config: EntityQueryConfig<Data>
): EntityQuery<Data> {
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
