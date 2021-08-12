import { Entity, EntityDefinition } from "./entity";
import { EntityDraft } from "./entity/draft";
import { EntityQuery } from "./entity/query";

export { defineEntity } from "./entity";

interface ClientDbConfig {
  dbName: string;
}

type EntitiesMap = Record<string, EntityDefinition<any>>;

type ClientDbEntityClient<Data> = {
  findById(id: string): Entity<Data> | null;
  removeById(id: string): boolean;
  query: (filter: (item: Data) => boolean) => EntityQuery<Data>;
  createDraft(input: Data): EntityDraft<Data>;
};

type ClientDb<Entities extends EntitiesMap> = {
  [key in keyof Entities]: Entities[key] extends EntityDefinition<infer Data> ? ClientDbEntityClient<Data> : never;
};

export function createClientDb<Entities extends EntitiesMap>(
  config: ClientDbConfig,
  entitiesMap: Entities
): ClientDb<Entities> {
  return null as any;
}
