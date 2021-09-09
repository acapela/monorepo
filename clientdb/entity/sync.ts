import { runInAction } from "mobx";

import { EntityDefinition } from "./definition";

interface SyncManager<Data> {
  updateItems(items: Data[]): void;
  removeItems(items: Data[]): void;
  lastSyncDate: Date;
}

type SyncCleanup = () => void;

export interface EntitySyncConfig<Data> {
  initPromise?: () => Promise<any>;
  pull?: (manager: SyncManager<Data>) => SyncCleanup | void;
  push?: (entityToSync: Data) => Promise<Data | false>;
}

interface EntitySyncManagerConfig<Data> {
  onPulledItems(items: Data[]): void;
  onItemRemoveRequest(items: Data[]): void;
  getLastSyncDate(): Date;
}

interface EntitySyncManager<Data> {
  cancel: () => void;
}

export function createEntitySyncManager<Data>(
  definition: EntityDefinition<Data, any>,
  config: EntitySyncManagerConfig<Data>
): EntitySyncManager<Data> {
  const syncConfig = definition.config.sync;

  if (!syncConfig) {
    throw new Error("no sync");
  }

  function getLastSyncDate() {
    const lastSyncDate = config.getLastSyncDate();

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
    return new Date(lastSyncDate.getTime() + 1);
  }

  function startNextSync() {
    let didScheduleAgain = false;
    function scheduleAgain() {
      if (didScheduleAgain) return;
      didScheduleAgain = true;

      cancelCurrent = startNextSync();
    }

    const maybeCleanup = syncConfig.pull?.({
      lastSyncDate: getLastSyncDate(),
      updateItems(items) {
        if (!items.length) return;

        maybeCleanup?.();
        runInAction(() => {
          config.onPulledItems(items);
        });

        scheduleAgain();
      },
      removeItems(items) {
        if (!items.length) return;
        maybeCleanup?.();
        runInAction(() => {
          config.onItemRemoveRequest(items);
        });

        scheduleAgain();
      },
    });

    return maybeCleanup;
  }

  async function init() {
    if (typeof document === "undefined") return;

    const foo = await syncConfig.initPromise?.();

    cancelCurrent = startNextSync();
  }

  init();

  let cancelCurrent: SyncCleanup | undefined | void = undefined;

  function cancel() {
    if (cancelCurrent) {
      cancelCurrent();
    }
  }

  return {
    cancel,
  };
}
