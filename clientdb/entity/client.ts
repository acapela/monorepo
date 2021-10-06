import { runInAction } from "mobx";

import { ClientAdapterConfig } from "./db/adapter";
import { EntityDefinition } from "./definition";
import { DatabaseUtilities } from "./entitiesConnections";
import { Entity, createEntity } from "./entity";
import { createEntityPersistanceManager } from "./persistance";
import { EntityQuery, EntityQueryConfig } from "./query";
import { createEntityStore } from "./store";
import { createEntitySyncManager } from "./sync";
import { EntityChangeSource } from "./types";

export type EntityClient<Data, Connections> = {
  findById(id: string): Entity<Data, Connections> | null;
  removeById(id: string, source?: EntityChangeSource): boolean;
  all: Entity<Data, Connections>[];
  find: (filter: EntityQueryConfig<Data, Connections>) => EntityQuery<Data, Connections>;
  create(input: Partial<Data>, source?: EntityChangeSource): Entity<Data, Connections>;
  update(id: string, input: Partial<Data>, source?: EntityChangeSource): Entity<Data, Connections>;
  createOrUpdate(input: Partial<Data>, source?: EntityChangeSource): Entity<Data, Connections>;
  destroy(): void;
  definition: EntityDefinition<Data, Connections>;
  persistanceLoaded: Promise<void>;
  firstSyncLoaded: Promise<void>;
};

export type EntityClientByDefinition<Def extends EntityDefinition<unknown, unknown>> = Def extends EntityDefinition<
  infer Data,
  infer Connections
>
  ? EntityClient<Data, Connections>
  : never;

interface EntityClientConfig {
  databaseUtilities: DatabaseUtilities;
  dbAdapterConfig?: ClientAdapterConfig;
}

/**
 * Client is 'public api' surface for entity.
 *
 * It also initializes synchronization and persistance.
 */
export function createEntityClient<Data, Connections>(
  definition: EntityDefinition<Data, Connections>,
  { databaseUtilities, dbAdapterConfig }: EntityClientConfig
): EntityClient<Data, Connections> {
  const store = createEntityStore<Data, Connections>(definition);

  function createEntityWithData(input: Partial<Data>) {
    return createEntity<Data, Connections>({ data: input, definition, store, databaseUtilities });
  }

  const persistanceManager = createEntityPersistanceManager(definition, {
    dbAdapterConfig,
    createNewEntity: (data) => {
      const entity = createEntityWithData(data);
      store.add(entity, "persistance");
    },
  });

  const syncManager = createEntitySyncManager<Data, Connections>(
    store,
    {
      entitySyncConfig: definition.config.sync,
      // We're passing callbacks that connects sync layer with client
      onItemsData(items) {
        runInAction(() => {
          items.forEach((item) => {
            client.createOrUpdate(item, "sync");
          });
        });
      },
      onItemRemoveRequest(idsToRemove) {
        runInAction(() => {
          idsToRemove.forEach((idToRemove) => {
            client.removeById(idToRemove, "sync");
          });
        });
      },
    },
    databaseUtilities
  );

  async function initialize() {
    await persistanceManager.loadPersistedData();
    persistanceManager.startPersistingChanges();
    syncManager.start();
  }

  const client: EntityClient<Data, Connections> = {
    definition,
    findById(id) {
      return store.findById(id);
    },
    get all() {
      return client.find({ filter: () => true, sort: definition.config.defaultSort }).all;
    },
    find(config) {
      return store.find(config);
    },
    removeById(id, source = "user") {
      return store.removeById(id, source);
    },
    create(input, source = "user") {
      const newEntity = createEntityWithData(input);
      return store.add(newEntity, source);
    },
    update(id, input, source = "user") {
      const entity = client.findById(id);

      if (!entity) {
        throw new Error("no update with this id");
      }

      entity.update(input, source);

      return entity;
    },
    createOrUpdate(input, source = "user") {
      const id = `${input[definition.config.keyField]}`;
      if (client.findById(id)) {
        return client.update(id, input, source);
      }

      const newEntity = createEntityWithData(input);
      return store.add(newEntity, source);
    },
    destroy() {
      persistanceManager.destroy();
      syncManager.cancel();
    },
    firstSyncLoaded: syncManager.firstSyncPromise,
    persistanceLoaded: persistanceManager.persistedItemsLoaded,
  };

  initialize();

  return client;
}

export type GetEntityClientByDefinition<Data, Connections> = (
  definition: EntityDefinition<Data, Connections>
) => EntityClient<Data, Connections>;
