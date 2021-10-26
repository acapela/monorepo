import { runInAction } from "mobx";

import { runUntracked } from "~shared/mobxUtils";
import { createResolvablePromise } from "~shared/promises";

import { DatabaseUtilities } from "./entitiesConnections";
import { Entity } from "./entity";
import { EntityStore } from "./store";
import { createPushQueue } from "./utils/pushQueue";

interface UpdatesSyncManager<Data> extends DatabaseUtilities {
  updateItems(items: Data[], isReloadNeeded?: boolean): void;
  lastSyncDate: Date;
  isFirstSync: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface RemovesSyncManager<Data> extends DatabaseUtilities {
  removeItems(idsToRemove: string[], lastUpdateDate?: Date): void;
  lastSyncDate: Date;
}

type SyncCleanup = () => void;

export interface EntitySyncConfig<Data> {
  initPromise?: () => Promise<void>;
  pullUpdated?: (manager: UpdatesSyncManager<Data>) => SyncCleanup | void;
  push?: (entityToSync: Entity<Data, unknown>, utils: DatabaseUtilities) => Promise<Data | false>;
  remove?: (entityToSync: Entity<Data, unknown>, utils: DatabaseUtilities) => Promise<boolean>;
  pullRemoves?: (manager: RemovesSyncManager<Data>) => SyncCleanup | void;
}

interface EntitySyncManagerConfig<Data> {
  onItemsData(items: Data[]): void;
  onItemRemoveRequest(itemsIds: string[]): void;
  entitySyncConfig: EntitySyncConfig<Data>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface EntitySyncManager<Data> {
  cancel: () => void;
  start(): Promise<void>;
  firstSyncPromise: Promise<void>;
}

const pushQueue = createPushQueue();

const awaitingPushOperationsMap = new WeakMap<Entity<unknown, unknown>, Set<Promise<unknown>>>();

function addAwaitingOperationToEntity<Data, Connections>(
  entity: Entity<Data, Connections>,
  operationPromise: Promise<unknown>
) {
  let currentlyAwaiting = awaitingPushOperationsMap.get(entity);

  if (!currentlyAwaiting) {
    currentlyAwaiting = new Set();
    awaitingPushOperationsMap.set(entity, currentlyAwaiting);
  }

  currentlyAwaiting.add(operationPromise);

  operationPromise.then(() => {
    currentlyAwaiting?.delete(operationPromise);
  });

  return operationPromise;
}

export async function waitForEntityAllAwaitingPushOperations<Data, Connections>(entity: Entity<Data, Connections>) {
  const awaitingOperations = awaitingPushOperationsMap.get(entity);

  if (!awaitingOperations) {
    return;
  }

  await Promise.all(Array.from(awaitingOperations));
}

/**
 * Sync manager sets manages running sync operations and repeating them after previous sync.
 */
export function createEntitySyncManager<Data, Connections>(
  store: EntityStore<Data, Connections>,
  config: EntitySyncManagerConfig<Data>,
  databaseUtilities: DatabaseUtilities
): EntitySyncManager<Data> {
  const syncConfig = store.definition.config.sync;

  const firstSyncPromise = createResolvablePromise<void>();

  // Watch for all local changes and as a side effect - push them to remote.
  function initializePushSync() {
    async function handleEntityCreatedOrUpdatedByUser(entity: Entity<Data, Connections>) {
      const entityDataFromServer = await store.definition.config.sync.push?.(entity, databaseUtilities);

      if (!entityDataFromServer) {
        console.warn(`Sync push failed`);
        return;
      }

      // After pushing entity to remote, always treat 'server' version as 'official' and make sure our local version is equal.
      entity.update(entityDataFromServer, "sync");
    }
    const cancelRemoves = store.events.on("itemRemoved", async (entity, source) => {
      if (source !== "user") return;

      function restoreEntity() {
        store.add(entity, "sync");
      }

      try {
        const result = await pushQueue.add(() => config.entitySyncConfig.remove?.(entity, databaseUtilities));
        if (result !== true) {
          restoreEntity();
          // TODO: Handle restore local entity in case of failure
        }
      } catch (error) {
        restoreEntity();
      }
    });

    const cancelUpdates = store.events.on("itemUpdated", async (entity, dataBefore, source) => {
      if (source !== "user") return;

      try {
        await addAwaitingOperationToEntity(
          entity,
          pushQueue.add(() => handleEntityCreatedOrUpdatedByUser(entity))
        );
      } catch (error) {
        entity.update(dataBefore, "sync");
      }
    });

    const cancelCreates = store.events.on("itemAdded", async (entity, source) => {
      if (source !== "user") return;
      try {
        await addAwaitingOperationToEntity(
          entity,
          pushQueue.add(() => handleEntityCreatedOrUpdatedByUser(entity))
        );
      } catch (error) {
        entity.remove("sync");
      }
    });

    return () => {
      cancelRemoves();
      cancelUpdates();
      cancelCreates();
    };
  }

  function getLastSyncDate() {
    // TODO: optimize by creating index or cached value modified on each remove/update/addition
    let initialDate = new Date(0);

    runUntracked(() => {
      store.items.forEach((item) => {
        const nextItemUpdatedAt = item.getUpdatedAt();

        if (nextItemUpdatedAt > initialDate) {
          initialDate = nextItemUpdatedAt;
        }
      });
    });

    return initialDate;
  }

  let isFirstSync = true;

  // Start waiting for new 'updates' data.
  function startNextUpdatesSync() {
    const maybeCleanup = syncConfig.pullUpdated?.({
      ...databaseUtilities,
      lastSyncDate: getLastSyncDate(),
      isFirstSync,
      updateItems(items, isReloadNeeded) {
        isFirstSync = false;
        firstSyncPromise.resolve();
        // Ignore empty update list (initial one is usually empty)
        if (!items.length && !isReloadNeeded) return;

        maybeCleanup?.();
        runInAction(() => {
          config.onItemsData(items);
        });

        // After new update is flushed - start waiting for next update
        startNextUpdatesSync();
      },
    });

    cancelCurrentUpdates = maybeCleanup;
  }

  /**
   * As deleted items 'disappear' we cannot use their updated_at to know when we got last update.
   *
   * Thus we will keep track of it during the lifecycle of sync.
   *
   * Initially set it to latest item date we locally have.
   */
  let lastRemoveSyncDate: Date | null = null;

  function startNextRemovesSync() {
    if (lastRemoveSyncDate === null) {
      lastRemoveSyncDate = getLastSyncDate();
    }
    const maybeCleanup = syncConfig.pullRemoves?.({
      ...databaseUtilities,
      lastSyncDate: lastRemoveSyncDate,
      removeItems(itemsIds, lastUpdateDate = new Date()) {
        if (!itemsIds.length) return;

        maybeCleanup?.();
        runInAction(() => {
          config.onItemRemoveRequest(itemsIds);
        });

        lastRemoveSyncDate = lastUpdateDate;

        startNextRemovesSync();
      },
    });

    cancelCurrentDeletes = maybeCleanup;
  }

  async function start() {
    // Only perform sync on client side
    if (typeof document === "undefined") return;

    await syncConfig.initPromise?.();

    cancelCurrentUpdates = startNextUpdatesSync();
    cancelCurrentDeletes = startNextRemovesSync();
  }

  let cancelCurrentUpdates: SyncCleanup | undefined | void = undefined;
  let cancelCurrentDeletes: SyncCleanup | undefined | void = undefined;

  const cancelPush = initializePushSync();

  function cancel() {
    if (cancelCurrentUpdates) {
      cancelCurrentUpdates();
    }

    if (cancelCurrentDeletes) {
      cancelCurrentDeletes();
    }

    cancelPush();
  }

  return {
    cancel,
    start,
    firstSyncPromise: firstSyncPromise.promise,
  };
}
