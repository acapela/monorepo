import { IComputedValue, computed } from "mobx";

import { Entity } from "~clientdb/entity/entity";

/**
 * Creates 'smart' entity cache that keeps result for given entity as no value it's getter uses.
 *
 * It is also cached as long as it is in use by any 'observer'.
 */
export function createEntityCache<Data, Connections, Result>(getter: (entity: Entity<Data, Connections>) => Result) {
  const cacheMap = new WeakMap<Entity<Data, Connections>, IComputedValue<Result>>();

  function getCached(entity: Entity<Data, Connections>): Result {
    const cachedValue = cacheMap.get(entity);

    if (cachedValue) {
      return cachedValue.get();
    }

    const newCachedValue = computed(
      () => {
        return getter(entity);
      },
      { name: `entityCachedValue` }
    );

    cacheMap.set(entity, newCachedValue);

    const result = newCachedValue.get();

    return result;
  }

  return getCached;
}
