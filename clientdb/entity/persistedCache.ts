import { AsyncReturnType } from "ink/node_modules/type-fest";

import { PersistanceAdapterInfo } from "~clientdb";
import { getHash } from "~shared/hash";
import { ValueUpdater, updateValue } from "~shared/updateValue";

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

interface CacheItem<V> {
  key: string;
  value: V;
}

/**
 * Will setup persistance storage database, and if needed wipe out existing data on schema change.
 */
export async function initializePersistedKeyValueCache({ adapter, nameSuffix }: PersistanceAdapterInfo) {
  const databaseName = getStorageDatabaseName(nameSuffix);
  const cacheDatabase = await adapter.openDB({
    name: databaseName,
    version: 1,
    tables: [{ keyField: "key", name: CACHE_DB_TABLE }],
  });
  const cacheTable = await cacheDatabase.getTable<CacheItem<unknown>>(CACHE_DB_TABLE);

  const allItems = await cacheTable.fetchAllItems();

  const cacheMap = new Map<string, unknown>();

  allItems.forEach((item) => {
    cacheMap.set(item.key, item.value);
  });

  function has(key: string): boolean {
    return cacheMap.has(key);
  }

  function get<V>(key: string): V | null {
    return (cacheMap.get(key) as V) ?? null;
  }

  function set<V>(key: string, value: V): Promise<boolean> {
    cacheMap.set(key, value);
    return cacheTable.saveItem(key, { key, value });
  }

  function update<V>(key: string, valueUpdated: ValueUpdater<V>) {
    if (!has(key)) {
      throw new Error(`Cannot update cache value for key ${key} - there is no existing value`);
    }

    const value = get(key);

    const newValue = updateValue(value as V, valueUpdated);

    return set(key, newValue);
  }

  function getOrCreate<V>(key: string, getter: () => V): V {
    if (has(key)) {
      return get<V>(key) as V;
    }

    const fresh = getter();

    set(key, fresh);

    return fresh;
  }

  return {
    get,
    set,
    has,
    update,
    getOrCreate,
  };
}

export type PersistedKeyValueCache = AsyncReturnType<typeof initializePersistedKeyValueCache>;
