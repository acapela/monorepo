import { IObservableArray, computed, observable, runInAction } from "mobx";

import { MessageOrError, assert } from "~shared/assert";
import { mapGetOrCreate } from "~shared/map";
import { typedKeys } from "~shared/object";

import { EntityDefinition } from "./definition";
import { DatabaseUtilities } from "./entitiesConnections";
import { Entity } from "./entity";
import { EntityQuery, EntityQueryConfig, createEntityQuery } from "./query";
import { QueryIndex, QueryIndexValue, createQueryFieldIndex } from "./queryIndex";
import { EntityChangeSource } from "./types";
import { computedArray } from "./utils/computedArray";
import { EventsEmmiter, createEventsEmmiter } from "./utils/eventManager";

export type EntitySimpleQuery<Data> = Partial<{
  [key in keyof Data]: QueryIndexValue<Data[key]>;
}>;

export type EntityStore<Data, Connections> = {
  items: IObservableArray<Entity<Data, Connections>>;
  findById(id: string): Entity<Data, Connections> | null;
  assertFindById(id: string, error?: MessageOrError): Entity<Data, Connections>;
  simpleQuery(simpleQuery: EntitySimpleQuery<Data>): Entity<Data, Connections>[];
  removeById(id: string, source?: EntityChangeSource): boolean;
  query: (filter: EntityQueryConfig<Data, Connections>) => EntityQuery<Data, Connections>;
  add(input: Entity<Data, Connections>, source?: EntityChangeSource): Entity<Data, Connections>;
  findByUniqueIndex<K extends keyof Data>(key: K, value: Data[K]): Entity<Data, Connections> | null;
  assertFindByUniqueIndex<K extends keyof Data>(key: K, value: Data[K]): Entity<Data, Connections>;
  events: EntityStoreEventsEmmiter<Data, Connections>;
  definition: EntityDefinition<Data, Connections>;
  destroy: () => void;
};

export type EntityStoreFromDefinition<Definition extends EntityDefinition<unknown, unknown>> =
  Definition extends EntityDefinition<infer Data, infer Connections> ? EntityStore<Data, Connections> : never;

type EntityStoreEvents<Data, Connections> = {
  itemAdded: [Entity<Data, Connections>, EntityChangeSource];
  itemUpdated: [entity: Entity<Data, Connections>, dataBefore: Data, source: EntityChangeSource];
  itemWillUpdate: [entity: Entity<Data, Connections>, input: Partial<Data>, source: EntityChangeSource];
  itemRemoved: [Entity<Data, Connections>, EntityChangeSource];
};

export type EntityStoreEventsEmmiter<Data, Connections> = EventsEmmiter<EntityStoreEvents<Data, Connections>>;

/**
 * Store is inner 'registry' of all items of given entity. It is like 'raw' database with no extra logic (like syncing)
 */
export function createEntityStore<Data, Connections>(
  definition: EntityDefinition<Data, Connections>,
  utilities: DatabaseUtilities
): EntityStore<Data, Connections> {
  type StoreEntity = Entity<Data, Connections>;
  const { config } = definition;
  /**
   * Keep 2 'versions' of items list. Array and id<>item map for quick 'by id' access.
   */
  const items = observable.array<StoreEntity>([]);
  const itemsMap = observable.object<Record<string, Entity<Data, Connections>>>({});

  // Allow listening to CRUD updates in the store
  const events = createEventsEmmiter<EntityStoreEvents<Data, Connections>>();

  const queryIndexes = new Map<keyof Data, QueryIndex<Data, Connections, keyof Data>>();

  // Each entity might have 'is deleted' flag which makes is 'as it is not existing' for the store.
  // Let's make sure we always filter such item out.
  const existingItems = computedArray(() => {
    return items.filter(getIsEntityAccessable);
  });

  function getIsEntityAccessable(entity: Entity<Data, Connections>) {
    const { getIsDeleted, accessValidator } = definition.config;

    if (getIsDeleted && !getIsDeleted(entity)) return false;

    if (accessValidator && !accessValidator(entity, utilities)) return false;

    return true;
  }

  function getExistingItemById(id: string) {
    const item = itemsMap[id];

    if (!item) {
      return null;
    }

    if (!getIsEntityAccessable(item)) {
      return null;
    }

    return item;
  }

  const store: EntityStore<Data, Connections> = {
    definition,
    events,
    items,
    add(entity, source = "user") {
      const id = `${entity[config.keyField]}`;

      runInAction(() => {
        items.push(entity);
        itemsMap[id] = entity;
        events.emit("itemAdded", entity, source);
      });

      return entity;
    },
    findById(id) {
      return computed(() => {
        return getExistingItemById(id);
      }).get();
    },
    assertFindById(id, error) {
      const item = store.findById(id);

      assert(item, error ?? `No item found for id ${id}`);

      return item;
    },
    simpleQuery(simpleQuery: EntitySimpleQuery<Data>): Entity<Data, Connections>[] {
      // Reuse the same array in case of same results to avoid waster observers triggers (like re-renders)
      return computedArray(() => {
        let passingResults: Entity<Data, Connections>[] | null = null;

        for (const requiredKey of typedKeys(simpleQuery)) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const requiredValue = simpleQuery[requiredKey]!;

          const index = mapGetOrCreate(queryIndexes, requiredKey, () => createQueryFieldIndex(requiredKey, store));

          const keyResults = index.find(requiredValue);

          // Nothing passed previous results. We can instantly return as there is no point to 'narrow down' empty result.
          if (!keyResults.length) {
            return [];
          }

          if (passingResults === null) {
            passingResults = keyResults;
            continue;
          }

          if (!passingResults.length) {
            return passingResults;
          }

          passingResults = passingResults.filter((previouslyPassedResult) =>
            keyResults.includes(previouslyPassedResult)
          );
        }

        return passingResults ?? [];
      }).get();
    },
    findByUniqueIndex<K extends keyof Data>(key: K, value: Data[K]) {
      const query: Partial<Data> = {};
      // TS was complaining about ^ {[key]: value} as it considered key as string in such case, not as keyof Data
      query[key] = value;

      return computed(() => {
        const results = store.simpleQuery(query);
        if (!results.length) return null;

        if (results.length > 1) console.warn(`Store has multiple items for unique index value ${key}:${value}.`);

        return results[0];
      }).get();
    },
    assertFindByUniqueIndex<K extends keyof Data>(key: K, value: Data[K]) {
      const entity = store.findByUniqueIndex(key, value);

      assert(entity, `Assertion error for assertFindByUniqueIndex for key ${key} and value ${value}`);

      return entity;
    },
    removeById(id, source = "user") {
      const entity = itemsMap[id] ?? null;

      if (entity === null) return false;

      let didRemove = false;

      runInAction(() => {
        didRemove = items.remove(entity);
        delete itemsMap[id];
      });

      events.emit("itemRemoved", entity, source);

      return didRemove;
    },
    query(config: EntityQueryConfig<Data, Connections>) {
      return createEntityQuery(() => existingItems.get(), config, store);
    },
    destroy() {
      queryIndexes.forEach((queryIndex) => {
        queryIndex.destroy();
      });
    },
  };

  return store;
}
