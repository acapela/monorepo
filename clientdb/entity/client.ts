import { runInAction } from "mobx";
import { EntityDefinition } from "./definition";
import { EntityDraft } from "./draft";
import { EntitiesConnectionsConfig } from "./entitiesConnections";
import { createEntity, Entity } from "./entity";
import { EntityQuery, EntityQueryConfig } from "./query";
import { createEntityStore } from "./store";
import { createEntitySyncManager } from "./sync";

export type EntityClient<Data, Connections> = {
  findById(id: string): Entity<Data, Connections> | null;
  removeById(id: string): boolean;
  query: (filter: EntityQueryConfig<Data>) => EntityQuery<Data & Connections>;
  createDraft(input: Data): EntityDraft<Data & Connections>;
  create(input: Data): Entity<Data, Connections>;
  update(id: string, input: Data): Entity<Data, Connections>;
  createOrUpdate(input: Data): Entity<Data, Connections>;
};

export type EntityClientFromDefinition<Definition extends EntityDefinition<any, any>> =
  Definition extends EntityDefinition<infer Data, infer Connections> ? EntityClient<Data, Connections> : never;

export function createEntityClient<Data, Connections>(
  definition: EntityDefinition<Data, Connections>,
  config: EntitiesConnectionsConfig
): EntityClient<Data, Connections> {
  const store = createEntityStore<Data, Connections>(definition);

  const client: EntityClient<Data, Connections> = {
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
    update(id, input) {
      const entity = client.findById(id);

      if (!entity) {
        throw new Error("no update with this id");
      }

      entity.update(input);

      return entity;
    },
    createOrUpdate(input) {
      console.log("create or update", input);
      const id = definition.config.getId(input);
      if (client.findById(id)) {
        return client.update(id, input);
      }

      const newEntity = createEntity(input, definition, config);
      return store.add(newEntity);
    },
  };

  const syncManager = createEntitySyncManager<Data>(definition, {
    onPulledItems(items) {
      runInAction(() => {
        items.forEach((item) => {
          console.log("add request", item);
          client.createOrUpdate(item);
        });
      });
    },
    onItemRemoveRequest() {
      //
    },
  });

  return client;
}

export type GetEntityClientByDefinition<Data, Connections> = (
  definition: EntityDefinition<Data, Connections>
) => EntityClient<Data, Connections>;
