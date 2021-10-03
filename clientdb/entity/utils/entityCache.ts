import { Entity } from "~clientdb/entity/entity";

interface CachedValue<D> {
  entityUpdatedAt: Date;
  value: D;
}

/**
 * Creates 'smart' entity cache that keeps result for given entity as long as 'updated at' column value is the same.
 *
 * This is based on core assumption that this field is always required and no data change can happen without 'updated at'
 * being changed as well.
 */
export function createEntityCache<Data, Connections, Result>(getter: (entity: Entity<Data, Connections>) => Result) {
  const cacheMap = new WeakMap<Entity<Data, Connections>, CachedValue<Result>>();

  function getCached(entity: Entity<Data, Connections>): Result {
    const cachedValue = cacheMap.get(entity);

    // If we have cached value - make sure 'updated at' did not change since it was created.
    if (cachedValue) {
      const entityUpdatedAt = entity.getUpdatedAt();
      if (entityUpdatedAt.getTime() === cachedValue.entityUpdatedAt.getTime()) {
        return cachedValue.value;
      }
    }

    const newValue = getter(entity);

    cacheMap.set(entity, { entityUpdatedAt: entity.getUpdatedAt(), value: newValue });

    return newValue;
  }

  return getCached;
}
