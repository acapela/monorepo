import { memoize } from "lodash";
import { runInAction } from "mobx";

import { createResolvablePromise } from "~shared/promises";

import { PersistanceDB } from "./db/adapter";
import { EntityDefinition } from "./definition";
import { EntityStore } from "./store";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type EntityPersistanceManager<Data, Connections> = {
  loadPersistedData(): Promise<void>;
  startPersistingChanges(): void;
  destroy(): void;
  persistedItemsLoaded: Promise<void>;
};

interface PersistanceManagerConfig<Data> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store: EntityStore<Data, any>;
  persistanceDb: PersistanceDB;
  createNewEntity: (data: Data) => void;
}

/**
 * Client is 'public api' surface for entity.
 *
 * It also initializes synchronization and persistance.
 */
export function createEntityPersistanceManager<Data, Connections>(
  definition: EntityDefinition<Data, Connections>,
  { persistanceDb, createNewEntity, store }: PersistanceManagerConfig<Data>
): EntityPersistanceManager<Data, Connections> {
  const persistedItems = createResolvablePromise<void>();

  const getPersistanceTable = memoize(async () => {
    const persistanceTablePromise = persistanceDb.getTable<Data>(definition.config.name);

    if (!persistanceTablePromise) return null;

    const persistanceTable = await persistanceTablePromise;

    return persistanceTable;
  });

  const loadPersistedData = memoize(async () => {
    const persistanceTable = await getPersistanceTable();

    if (!persistanceTable) return;

    // Instantly fetch all already persisted items
    const allItems = await persistanceTable.fetchAllItems();

    runInAction(() => {
      // For all persisted items, create entities and add them
      allItems.forEach((item) => {
        createNewEntity(item);
      });
    });

    persistedItems.resolve();
  });

  let currentCancelPromise: Promise<(() => void) | null>;

  async function startPersistingChanges() {
    await loadPersistedData();
    const persistanceTable = await getPersistanceTable();

    if (!persistanceTable) return null;

    // Persist all changes locally
    const cancelAdded = store.events.on("itemAdded", (entity) => {
      persistanceTable.saveItem(entity.getData());
    });

    const cancelRemoved = store.events.on("itemRemoved", (entity) => {
      persistanceTable.removeItem(entity.getKey());
    });

    const cancelUpdated = store.events.on("itemUpdated", (entity) => {
      persistanceTable.saveItem(entity.getData());
    });

    return () => {
      cancelAdded();
      cancelRemoved();
      cancelUpdated();
    };
  }

  async function destroy() {
    if (!currentCancelPromise) {
      return;
    }

    const cancelSync = await currentCancelPromise;

    cancelSync?.();
  }

  return { loadPersistedData, startPersistingChanges, destroy, persistedItemsLoaded: persistedItems.promise };
}

export type GetEntityClientByDefinition<Data, Connections> = (
  definition: EntityDefinition<Data, Connections>
) => EntityPersistanceManager<Data, Connections>;
