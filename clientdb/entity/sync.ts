interface SyncManager<Data> {
  updateItems(items: Data[]): void;
  removeItems(item: Data[]): void;
  lastSyncDate: Date | null;
}

type SyncCleanup = () => void;

export interface EntitySyncConfig<Data> {
  pull?: (manager: SyncManager<Data>) => SyncCleanup | void;
  push?: (entityToSync: Data) => Promise<Data | false>;
}
