import { PersistedKeyValueCache } from "./persistedCache";

interface EntityCacheItem<V> {
  value: V;
  updatedAt: Date;
}

export function createEntitiesPersistedCache(cacheManager: PersistedKeyValueCache) {
  function getCached<V, D, C>(
    cacheKey: string,
    entityKey: string,
    entityName: string,
    updatedAt: Date,
    data: D,
    getter: (data: D) => V
  ): V {
    const fullCacheKey = `${entityName}-${entityKey}-${cacheKey}`;
    const cachedValue = cacheManager.get<EntityCacheItem<V>>(fullCacheKey);

    if (!cachedValue || updatedAt > cachedValue.updatedAt) {
      const newValue = getter(data);
      cacheManager.set<EntityCacheItem<V>>(fullCacheKey, { updatedAt, value: newValue });

      return newValue;
    }

    return cachedValue.value;
  }

  return { getCached };
}

export type EntityPersistedCache = ReturnType<typeof createEntitiesPersistedCache>;
