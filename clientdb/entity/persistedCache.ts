import { PersistanceTableAdapter } from "@aca/clientdb";
import { AsyncReturnType } from "@aca/shared/types";
import { ValueUpdater, updateValue } from "@aca/shared/updateValue";

interface CacheItem<V> {
  key: string;
  value: V;
}

/**
 * Will setup persistance storage database, and if needed wipe out existing data on schema change.
 */
export async function initializePersistedKeyValueCache(_cacheTable: PersistanceTableAdapter<unknown>) {
  const cacheTable = _cacheTable as PersistanceTableAdapter<CacheItem<unknown>>;
  const allItems = await cacheTable.fetchAllItems();

  const cacheMap = new Map<string, unknown>();

  allItems.forEach((item: CacheItem<unknown>) => {
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
    return cacheTable.saveItem({ key, value });
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
