interface SyncManager<Data> {
  updateItems(items: Data[]): void;
  removeItems(item: Data[]): void;
  lastSyncDate: Date | null;
}

type SyncCleanup = () => void;

export interface EntitySyncConfig<Data> {
  runSync: (manager: SyncManager<Data>) => SyncCleanup | void;
}
