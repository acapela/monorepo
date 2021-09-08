import { runInAction } from "mobx";

import { ClientAdapterConfig } from "./db/adapter";
import { EntityDefinition } from "./definition";
import { EntityDraft } from "./draft";
import { EntitiesConnectionsConfig } from "./entitiesConnections";
import { Entity, createEntity } from "./entity";
import { EntityQuery, EntityQueryConfig } from "./query";
import { createEntityStore } from "./store";
import { createEntitySyncManager } from "./sync";
import { EventsEmmiter, createEventsEmmiter } from "./utils/eventManager";

export type EntityClient<Data, Connections> = {
  findById(id: string): Entity<Data, Connections> | null;
  removeById(id: string): boolean;
  query: (filter: EntityQueryConfig<Data, Connections>) => EntityQuery<Data, Connections>;
  createDraft(input: Data): EntityDraft<Data & Connections>;
  create(input: Data): Entity<Data, Connections>;
  update(id: string, input: Data): Entity<Data, Connections>;
  createOrUpdate(input: Data): Entity<Data, Connections>;
};

interface EntityClientConfig {
  connectionsConfig: EntitiesConnectionsConfig;
  dbAdapterConfig?: ClientAdapterConfig;
}

export function createEntityClient<Data, Connections>(
  definition: EntityDefinition<Data, Connections>,
  { connectionsConfig, dbAdapterConfig }: EntityClientConfig
): EntityClient<Data, Connections> {
  const store = createEntityStore<Data, Connections>(definition);

  const persistanceTablePromise = dbAdapterConfig?.dbAdapter?.getTable<Data>({
    name: definition.config.name,
    keyField: definition.config.keyField,
  });

  async function initializePersistance() {
    if (!persistanceTablePromise) return;

    const persistanceTable = await persistanceTablePromise;

    console.log({ persistanceTable });

    const allItems = await persistanceTable.fetchAllItems();

    console.log("initial one", { allItems });

    runInAction(() => {
      allItems.forEach((item) => {
        client.create(item);
      });
    });

    store.events.on("itemAdded", (entity) => {
      console.log("added", { entity });
      persistanceTable.saveItem(entity.getKey(), entity.getData());
    });

    store.events.on("itemRemoved", (entity) => {
      persistanceTable.removeItem(entity.getKey());
    });

    store.events.on("itemUpdated", (entity) => {
      persistanceTable.saveItem(entity.getKey(), entity.getData());
    });
  }

  async function initializeSync() {
    const syncManager = createEntitySyncManager<Data>(definition, {
      onPulledItems(items) {
        runInAction(() => {
          items.forEach((item) => {
            client.createOrUpdate(item);
          });
        });
      },
      onItemRemoveRequest() {
        //
      },
    });
  }

  async function initialize() {
    await initializePersistance();
    await initializeSync();
  }

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
      const newEntity = createEntity(input, definition, store, connectionsConfig);
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
      const id = `${input[definition.config.keyField]}`;
      if (client.findById(id)) {
        return client.update(id, input);
      }

      const newEntity = createEntity(input, definition, store, connectionsConfig);
      return store.add(newEntity);
    },
  };

  initialize();

  return client;
}

export type GetEntityClientByDefinition<Data, Connections> = (
  definition: EntityDefinition<Data, Connections>
) => EntityClient<Data, Connections>;
