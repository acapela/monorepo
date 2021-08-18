import { EntityDefinition } from "./definition";

interface SyncManager<Data> {
  updateItems(items: Data[]): void;
  removeItems(items: Data[]): void;
  lastSyncDate: Date | null;
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
}

interface EntitySyncManager<Data> {
  pushItem(item: Data): void;
}

export function createEntitySyncManager<Data>(
  definition: EntityDefinition<Data, any>,
  config: EntitySyncManagerConfig<Data>
): EntitySyncManager<Data> {
  let lastSyncDate: Date | null = new Date(0);
  const syncConfig = definition.config.sync;

  if (!syncConfig) {
    throw new Error("no sync");
  }

  function startNextSync() {
    console.log("sync", definition.config.name);
    let didScheduleAgain = false;
    function scheduleAgain() {
      console.log("again", definition.config.name);
      if (didScheduleAgain) return;
      didScheduleAgain = true;

      lastSyncDate = new Date();

      startNextSync();
    }

    console.log({ lastSyncDate });
    const maybeCleanup = syncConfig.pull?.({
      lastSyncDate,
      updateItems(items) {
        console.log("will try update", definition.config.name, { items });
        if (!items.length) return;

        maybeCleanup?.();
        config.onPulledItems(items);
        scheduleAgain();
      },
      removeItems(items) {
        if (!items.length) return;
        maybeCleanup?.();
        config.onPulledItems(items);
        scheduleAgain();
      },
    });

    return maybeCleanup;
  }

  async function init() {
    if (typeof document === "undefined") return;

    const foo = await syncConfig.initPromise?.();

    console.log({ foo });
    startNextSync();
  }

  init();

  return {
    pushItem() {
      //
    },
  };
}
