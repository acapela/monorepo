import { Entity } from "~clientdb/entity/entity";

import { LazyComputed, lazyComputed } from "./lazyComputed";

/**
 * Creates 'smart' entity cache that keeps result for given entity as no value it's getter uses.
 *
 * It is also cached as long as it is in use by any 'observer'.
 */
export function createEntityCache<Data, Connections, Result>(
  getter: (entity: Entity<Data, Connections>) => Result,
  name?: string
) {
  const cacheMap = new WeakMap<Entity<Data, Connections>, LazyComputed<Result>>();

  function getCached(entity: Entity<Data, Connections>): Result {
    const cachedValue = cacheMap.get(entity);

    if (cachedValue) {
      return cachedValue.get();
    }

    const newCachedValue = lazyComputed(
      () => {
        return getter(entity);
      },
      { name: `${entity.definition.config.name}-${entity.getKey()}-${name}-cached` }
    );

    cacheMap.set(entity, newCachedValue);

    return newCachedValue.get();
  }

  return getCached;
}
