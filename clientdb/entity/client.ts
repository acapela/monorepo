import { EntityDefinition } from "./definition";
import { EntityDraft } from "./draft";
import { EntitiesConnectionsConfig } from "./entitiesConnections";
import { createEntity, Entity } from "./entity";
import { EntityQuery, EntityQueryConfig } from "./query";
import { createEntityStore } from "./store";

export type EntityClient<Data> = {
  findById(id: string): Entity<Data> | null;
  removeById(id: string): boolean;
  query: (filter: EntityQueryConfig<Data>) => EntityQuery<Data>;
  createDraft(input: Data): EntityDraft<Data>;
  create(input: Data): Entity<Data>;
};

export function createEntityClient<Data, Connections>(
  definition: EntityDefinition<Data, Connections>,
  config: EntitiesConnectionsConfig
): EntityClient<Data & Connections> {
  const store = createEntityStore<Data, Connections>(definition);
  return {
    createDraft(input) {
      throw "unimplemented";
    },
    findById(id) {
      return store.findById(id);
    },
    query(config) {
      return store.query(config);
    },
    removeById(id) {
      return store.removeById(id);
    },
    create(input) {
      const newEntity = createEntity(input, definition, config);
      return store.add(newEntity);
    },
  };
}

export type GetEntityClientByDefinition<Data, Connections> = (
  definition: EntityDefinition<Data, Connections>
) => EntityClient<Data & Connections>;
