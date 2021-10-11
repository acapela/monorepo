import { PersistanceAdapterInfo } from "~clientdb";

/**
 * Note: it turned out not to be needed, as we started using flexsearch which indexes items really quickly.
 * I'm leaving this code in case we'll need it later. (which is likely)
 */

/**
 * To avoid conflicts with other IndexedDb we always add clientdb string to database name.
 */
const CACHE_DB_NAME = "clientdb-cache";
const CACHE_DB_TABLE = "cache";

function getStorageDatabaseName(suffix?: string) {
  if (!suffix) {
    return CACHE_DB_NAME;
  }

  return `${CACHE_DB_NAME}-${suffix}`;
}

export interface PersistedCache {
  get<V>(key: string): Promise<V | null>;
  set<V>(key: string, value: V): Promise<boolean>;
  getOrCreate<V>(key: string, getter: () => V): Promise<V>;
}

interface CacheItem<V> {
  key: string;
  value: V;
}

/**
 * Will setup persistance storage database, and if needed wipe out existing data on schema change.
 */
export async function initializePersistedCache({
  adapter,
  nameSuffix,
}: PersistanceAdapterInfo): Promise<PersistedCache> {
  const databaseName = getStorageDatabaseName(nameSuffix);
  const cacheDatabase = await adapter.openDB({
    name: databaseName,
    version: 1,
    tables: [{ keyField: "key", name: CACHE_DB_TABLE }],
  });
  const cacheTable = await cacheDatabase.getTable<CacheItem<unknown>>(CACHE_DB_TABLE);

  async function get<V>(key: string): Promise<V | null> {
    const result = await cacheTable.fetchItem(key);

    return (result?.value as V) ?? null;
  }

  async function set<V>(key: string, value: V): Promise<boolean> {
    return cacheTable.saveItem(key, { key, value });
  }

  async function getOrCreate<V>(key: string, getter: () => V): Promise<V> {
    const existing = await get<V>(key);

    if (existing !== null) {
      return existing;
    }

    const fresh = getter();

    await set(key, fresh);

    return fresh;
  }

  return {
    get,
    set,
    getOrCreate,
  };
}
