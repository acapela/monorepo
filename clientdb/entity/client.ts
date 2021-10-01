import { runInAction } from "mobx";

import { ClientAdapterConfig } from "./db/adapter";
import { EntityDefinition } from "./definition";
import { DatabaseUtilities } from "./entitiesConnections";
import { CreateEntityConfig, Entity, createEntity } from "./entity";
import { EntityQuery, EntityQueryConfig } from "./query";
import { createEntityStore } from "./store";
import { createEntitySyncManager } from "./sync";
import { EntityChangeSource } from "./types";

export type EntityClient<Data, Connections> = {
  findById(id: string): Entity<Data, Connections> | null;
  removeById(id: string, source?: EntityChangeSource): boolean;
  all: Entity<Data, Connections>[];
  query: (filter: EntityQueryConfig<Data, Connections>) => EntityQuery<Data, Connections>;
  create(input: Partial<Data>, source?: EntityChangeSource): Entity<Data, Connections>;
  update(id: string, input: Partial<Data>, source?: EntityChangeSource): Entity<Data, Connections>;
  createOrUpdate(input: Partial<Data>, source?: EntityChangeSource): Entity<Data, Connections>;
  destroy(): void;
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

const noop = () => void 0;

export function createEntityClient<Data, Connections>(
  definition: EntityDefinition<Data, Connections>,
  { databaseUtilities, dbAdapterConfig }: EntityClientConfig
): EntityClient<Data, Connections> {
  const store = createEntityStore<Data, Connections>(definition);

  const persistanceTablePromise = dbAdapterConfig?.dbAdapter?.getTable<Data>({
    name: definition.config.name,
    keyField: definition.config.keyField,
  });

  async function initializePersistance() {
    if (!persistanceTablePromise) return noop;

    const persistanceTable = await persistanceTablePromise;

    const allItems = await persistanceTable.fetchAllItems();

    runInAction(() => {
      allItems.forEach((item) => {
        client.create(item, "persistance");
      });
    });

    const cancelAdded = store.events.on("itemAdded", (entity) => {
      persistanceTable.saveItem(entity.getKey(), entity.getData());
    });

    const cancelRemoved = store.events.on("itemRemoved", (entity) => {
      persistanceTable.removeItem(entity.getKey());
    });

    const cancelUpdated = store.events.on("itemUpdated", (entity) => {
      persistanceTable.saveItem(entity.getKey(), entity.getData());
    });

    return () => {
      cancelAdded();
      cancelRemoved();
      cancelUpdated();
    };
  }

  function getLastSyncDate() {
    // TODO: optimize by creating index or cached value modified on each remove/update/addition
    let initialDate = new Date(0);

    store.items.forEach((item) => {
      const nextItemUpdatedAt = item.getUpdatedAt();

      if (nextItemUpdatedAt > initialDate) {
        initialDate = nextItemUpdatedAt;
      }
    });

    return new Date(initialDate.getTime());
  }

  async function initializeSync() {
    const syncManager = createEntitySyncManager<Data, Connections>(
      store,
      {
        getLastSyncDate,
        onPulledItems(items) {
          runInAction(() => {
            items.forEach((item) => {
              console.log("sync pull", { item });
              client.createOrUpdate(item, "sync");
            });
          });
        },
        onItemRemoveRequest(items) {
          runInAction(() => {
            items.forEach((item) => {
              const itemId = `${item[definition.config.keyField]}`;
              client.removeById(itemId, "sync");
            });
          });
        },
      },
      databaseUtilities
    );

    return syncManager.cancel;
  }

  async function initialize() {
    const cancelPersistance = await initializePersistance();
    const cancelSync = await initializeSync();

    return () => {
      cancelPersistance();
      cancelSync();
    };
  }

  const client: EntityClient<Data, Connections> = {
    findById(id) {
      return store.findById(id);
    },
    get all() {
      return client.query({ filter: () => true, sort: definition.config.defaultSort }).all;
    },
    query(config) {
      return store.query(config);
    },
    removeById(id, source) {
      return store.removeById(id, source);
    },
    create(input, source = "user") {
      const newEntity = createEntity(input, definition, store, databaseUtilities, source);
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

      const newEntity = createEntity(input, definition, store, databaseUtilities, source);
      return store.add(newEntity, source);
    },
    destroy() {
      cancelSyncAndPersistancePromise.then((cancel) => {
        cancel();
      });
    },
  };

  const cancelSyncAndPersistancePromise = initialize();

  return client;
}

export type GetEntityClientByDefinition<Data, Connections> = (
  definition: EntityDefinition<Data, Connections>
) => EntityClient<Data, Connections>;
