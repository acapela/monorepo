import { runInAction } from "mobx";

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
  onPulledItems(items: Data[]): void;
  onItemRemoveRequest(itemsIds: string[]): void;
  getLastSyncDate(): Date;
  entitySyncConfig: EntitySyncConfig<Data>;
}

interface EntitySyncManager<Data> {
  cancel: () => void;
}

export function createEntitySyncManager<Data, Connections>(
  store: EntityStore<Data, Connections>,
  config: EntitySyncManagerConfig<Data>,
  databaseUtilities: DatabaseUtilities
): EntitySyncManager<Data> {
  const syncConfig = store.definition.config.sync;

  if (!syncConfig) {
    throw new Error("no sync");
  }

  function initializePushSync() {
    async function handlePushEntity(entity: Entity<Data, Connections>) {
      const serverData = await store.definition.config.sync.push?.(entity, databaseUtilities);

      if (!serverData) {
        console.warn(`Sync push failed`);
        return;
      }

      entity.update(serverData, "sync");
    }
    const cancelRemoves = store.events.on("itemRemoved", async (entity, source) => {
      if (source !== "user") return;

      const result = await config.entitySyncConfig.remove?.(entity, databaseUtilities);

      if (result !== true) {
        // TODO: Handle restore local entity in case of failure
      }
    });

    const cancelUpdates = store.events.on("itemUpdated", async (entity, source) => {
      if (source !== "user") return;

      await handlePushEntity(entity);
    });

    const cancelCreates = store.events.on("itemAdded", async (entity, source) => {
      if (source !== "user") return;
      await handlePushEntity(entity);
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

    /**
     * Note, this is a bit interesting.
     *
     * So Hasura keeps a bit more 'precise' data than native JS Date can keep.
     *
     * Native JS Date keeps milliseconds as integer, while Hasura describes also decimal parts of millisecond.
     *
     * eg (real example) we might have date client side 2021-09-08T10:23:53.037, but hasura will actually keep and return: 2021-09-08T10:23:53.0372
     *
     * They're nearly the same, but 'nearly' makes all the difference. looking at sub-second part it is
     * .037 vs .0372
     * aka. 37ms vs 37.2ms
     *
     * This is very slight difference of 0.2ms, however it will break sync as we'll keep receiving the same item over and over because
     * .0372 is greater than .037.
     *
     * As there is no simple way to keep more precision than integer millisecond in javascript Date, I decided to add 1 MS to last sync date which solves the issue.
     *
     * This introduces very unlikely risk of race condition when some element was updated eg 0.5ms (server time) after our last sync date.
     * In such case we'd skip this element and never receive update about it until it is updated next time.
     */
    return new Date(initialDate.getTime() + 1);
  }

  function startNextUpdatesSync() {
    function scheduleAgain() {
      cancelCurrentUpdates = startNextUpdatesSync();
    }

    const maybeCleanup = syncConfig.pullUpdated?.({
      ...databaseUtilities,
      lastSyncDate: getLastSyncDate(),
      updateItems(items) {
        if (!items.length) return;

        maybeCleanup?.();
        runInAction(() => {
          config.onPulledItems(items);
        });

        scheduleAgain();
      },
    });

    return maybeCleanup;
  }

  let lastRemoveSyncDate = getLastSyncDate();

  function startNextRemovesSync() {
    function scheduleAgain() {
      cancelCurrentDeletes = startNextRemovesSync();
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

        scheduleAgain();
      },
    });

    return maybeCleanup;
  }

  async function init() {
    if (typeof document === "undefined") return;

    await syncConfig.initPromise?.();

    cancelCurrentUpdates = startNextUpdatesSync();
    cancelCurrentDeletes = startNextRemovesSync();
  }

  init();

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
  };
}
