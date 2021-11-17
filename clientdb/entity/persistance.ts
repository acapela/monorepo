import { memoize, throttle } from "lodash";
import { runInAction } from "mobx";

import { createResolvablePromise } from "~shared/promises";

import { PersistanceDB } from "./db/adapter";
import { EntityDefinition } from "./definition";
import { EntityStore } from "./store";
import { createPushQueue } from "./utils/pushQueue";

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

const persistanceExecuteQueue = createPushQueue();

export const PERSISTANCE_BATCH_FLUSH_TIMEOUT = 50;

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

    /**
     * We're batching updates in quick interval to save performance.
     * To ensure proper order of batched operations we keep both 'save' and 'remove' queues.
     *
     * As soon as operations of the same type are collected, they're batched, but if operation type changes, it is instantly flushed.
     */

    const batchSaveQueue = new Set<Data>();
    const batchRemoveQueue = new Set<string>();

    const flushQueue = () => {
      if (batchSaveQueue.size && batchRemoveQueue.size) {
        throw new Error("Incorrect state - both save and remove at once - cannot guarantee proper order");
      }

      if (batchSaveQueue.size) {
        const saveItems = Array.from(batchSaveQueue);
        batchSaveQueue.clear();

        persistanceExecuteQueue.add(() => persistanceTable.saveItems(saveItems));
      }

      if (batchRemoveQueue.size) {
        const removeItems = Array.from(batchRemoveQueue);

        batchRemoveQueue.clear();

        persistanceExecuteQueue.add(() => persistanceTable.removeItems(removeItems));
      }
    };

    const throttledFlushQueue = throttle(flushQueue, PERSISTANCE_BATCH_FLUSH_TIMEOUT, {
      leading: false,
      trailing: true,
    });

    // Persist all changes locally
    const cancelAdded = store.events.on("itemAdded", (entity) => {
      if (batchRemoveQueue.size) {
        flushQueue();
      }
      batchSaveQueue.add(entity.getData());
      throttledFlushQueue();
    });

    const cancelUpdated = store.events.on("itemUpdated", (entity) => {
      if (batchRemoveQueue.size) {
        flushQueue();
      }
      batchSaveQueue.add(entity.getData());
      throttledFlushQueue();
    });

    const cancelRemoved = store.events.on("itemRemoved", (entity) => {
      if (batchSaveQueue.size) {
        flushQueue();
      }
      batchRemoveQueue.add(entity.getKey());
      throttledFlushQueue();
    });

    return () => {
      cancelAdded();
      cancelRemoved();
      cancelUpdated();
      throttledFlushQueue.cancel();
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
