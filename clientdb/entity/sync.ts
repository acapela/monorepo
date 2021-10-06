import { runInAction } from "mobx";

import { createResolvablePromise } from "~shared/promises";

import { DatabaseUtilities } from "./entitiesConnections";
import { Entity } from "./entity";
import { EntityStore } from "./store";

interface UpdatesSyncManager<Data> extends DatabaseUtilities {
  updateItems(items: Data[]): void;
  lastSyncDate: Date;
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

/**
 * Sync manager sets manages running sync operations and repeating them after previous sync.
 */
export function createEntitySyncManager<Data, Connections>(
  store: EntityStore<Data, Connections>,
  config: EntitySyncManagerConfig<Data>,
  databaseUtilities: DatabaseUtilities
): EntitySyncManager<Data> {
  const syncConfig = store.definition.config.sync;

  const [firstSyncPromise, resolveFirstSyncPromise] = createResolvablePromise<void>();

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
        const result = await config.entitySyncConfig.remove?.(entity, databaseUtilities);
        if (result !== true) {
          restoreEntity();
          // TODO: Handle restore local entity in case of failure
        }
      } catch (error) {
        restoreEntity();
      }
    });

    const cancelUpdates = store.events.on("itemUpdated", async (entity, source, dataBefore) => {
      if (source !== "user") return;

      try {
        await handleEntityCreatedOrUpdatedByUser(entity);
      } catch (error) {
        entity.update(dataBefore, "sync");
      }
    });

    const cancelCreates = store.events.on("itemAdded", async (entity, source) => {
      if (source !== "user") return;
      try {
        await handleEntityCreatedOrUpdatedByUser(entity);
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

    store.items.forEach((item) => {
      const nextItemUpdatedAt = item.getUpdatedAt();

      if (nextItemUpdatedAt > initialDate) {
        initialDate = nextItemUpdatedAt;
      }
    });

    return initialDate;
  }

  // Start waiting for new 'updates' data.
  function startNextUpdatesSync() {
    const maybeCleanup = syncConfig.pullUpdated?.({
      ...databaseUtilities,
      lastSyncDate: getLastSyncDate(),
      updateItems(items) {
        resolveFirstSyncPromise();
        // Ignore empty update list (initial one is usually empty)
        if (!items.length) return;

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
  let lastRemoveSyncDate = getLastSyncDate();

  function startNextRemovesSync() {
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
    firstSyncPromise,
  };
}
