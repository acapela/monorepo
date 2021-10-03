import { Entity } from "~clientdb/entity/entity";

interface CachedValue<D> {
  entityUpdatedAt: Date;
  value: D;
}

export function createEntityCache<Data, Connections, Result>(getter: (entity: Entity<Data, Connections>) => Result) {
  const cacheMap = new WeakMap<Entity<Data, Connections>, CachedValue<Result>>();
  function getCached(entity: Entity<Data, Connections>): Result {
    const cachedValue = cacheMap.get(entity);

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
