import { runInAction } from "mobx";

import { assert } from "~shared/assert";

import { PersistanceDB } from "./db/adapter";
import { EntityDefinition } from "./definition";
import { DatabaseUtilities } from "./entitiesConnections";
import { Entity, createEntity } from "./entity";
import { createEntityPersistanceManager } from "./persistance";
import { EntityQuery, EntityQueryConfig } from "./query";
import { createEntitySearch } from "./search";
import { createEntityStore } from "./store";
import { createEntitySyncManager } from "./sync";
import { EntityChangeSource } from "./types";

export type EntityClient<Data, Connections> = {
  findById(id: string): Entity<Data, Connections> | null;
  assertFindById(id: string, errorMessage?: string): Entity<Data, Connections>;
  findByUniqueIndex<K extends keyof Data>(key: K, value: Data[K]): Entity<Data, Connections> | null;
  assertFindByUniqueIndex<K extends keyof Data>(key: K, value: Data[K]): Entity<Data, Connections>;
  removeById(id: string, source?: EntityChangeSource): boolean;
  all: Entity<Data, Connections>[];
  search(term: string): Entity<Data, Connections>[];
  query: (filter: EntityQueryConfig<Data, Connections>) => EntityQuery<Data, Connections>;
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
  persistanceDb: PersistanceDB;
}

/**
 * Client is 'public api' surface for entity.
 *
 * It also initializes synchronization and persistance.
 */
export function createEntityClient<Data, Connections>(
  definition: EntityDefinition<Data, Connections>,
  { databaseUtilities, persistanceDb }: EntityClientConfig
): EntityClient<Data, Connections> {
  const store = createEntityStore<Data, Connections>(definition);

  const searchEngine = definition.config.search ? createEntitySearch(definition.config.search, store) : null;

  function createEntityWithData(input: Partial<Data>) {
    return createEntity<Data, Connections>({ data: input, definition, store, databaseUtilities });
  }

  const persistanceManager = createEntityPersistanceManager(definition, {
    persistanceDb,
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
    assertFindById(id, errorMessage) {
      const item = store.findById(id);

      assert(item, errorMessage ?? `Entity ${definition.config.name} assertion failed. No item with id ${id}`);

      return item;
    },
    findByUniqueIndex<K extends keyof Data>(key: K, value: Data[K]) {
      return store.findByUniqueIndex(key, value);
    },
    assertFindByUniqueIndex<K extends keyof Data>(key: K, value: Data[K]): Entity<Data, Connections> {
      return store.assertFindByUniqueIndex(key, value);
    },
    search(term) {
      assert(searchEngine, `No search configuration is provided for entity ${definition.config.name}`);

      return searchEngine.search(term);
    },
    get all() {
      return client.query({ filter: () => true, sort: definition.config.defaultSort }).all;
    },
    query(config) {
      return store.query(config);
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
      store.destroy();
      searchEngine?.destroy();
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
