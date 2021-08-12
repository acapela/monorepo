export type EntityQuery<Data> = {
  all: Data[];
  query: (filter: (item: Data) => boolean) => EntityQuery<Data>;
};
