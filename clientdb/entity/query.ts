import { computed, IObservableArray } from "mobx";

type EntityQueryFilter<Data> = (item: Data) => boolean;

type EntityQueryResolvedConfig<Data> = {
  filter: EntityQueryFilter<Data>;
  sort?: any;
};

export type EntityQueryConfig<Data> = EntityQueryFilter<Data> | EntityQueryResolvedConfig<Data>;

function resolveEntityQueryConfig<Data>(config: EntityQueryConfig<Data>): EntityQueryResolvedConfig<Data> {
  if (typeof config === "function") {
    return {
      filter: config,
    };
  }

  return config;
}

export type EntityQuery<Data> = {
  all: Data[];
  query: (config: EntityQueryConfig<Data>) => EntityQuery<Data>;
};

export function createEntityQuery<Data>(
  source: IObservableArray<Data> | Data[],
  config: EntityQueryConfig<Data>
): EntityQuery<Data> {
  const { filter, sort } = resolveEntityQueryConfig(config);

  const passingItems = computed(() => {
    return source.filter(filter);
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
