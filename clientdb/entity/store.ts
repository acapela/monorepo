import { IObservableArray, autorun, computed, observable, runInAction } from "mobx";

import { areArraysShallowEqual } from "@aca/shared/array";
import { MessageOrError, assert } from "@aca/shared/assert";
import { createCleanupObject } from "@aca/shared/cleanup";
import { createReuseValueGroup } from "@aca/shared/createEqualReuser";
import { deepMemoize } from "@aca/shared/deepMap";
import { mapGetOrCreate } from "@aca/shared/map";
import { typedKeys } from "@aca/shared/object";

import { EntityDefinition } from "./definition";
import { DatabaseLinker } from "./entitiesConnections";
import { Entity } from "./entity";
import {
  EntityFilterInput,
  EntityQuery,
  EntityQuerySortFunction,
  EntityQuerySortInput,
  createEntityQuery,
  resolveSortInput,
} from "./query";
import { IndexQueryInput, QueryIndex, createQueryFieldIndex } from "./queryIndex";
import { EntityChangeSource } from "./types";
import { createArrayFirstComputed } from "./utils/arrayFirstComputed";
import { EventsEmmiter, createEventsEmmiter } from "./utils/eventManager";
import { cachedComputed } from ".";

export interface EntityStoreFindMethods<Data, Connections> {
  query: (
    filter: EntityFilterInput<Data, Connections>,
    sort?: EntityQuerySortFunction<Data, Connections>
  ) => EntityQuery<Data, Connections>;

  sort: (sort: EntityQuerySortInput<Data, Connections>) => EntityQuery<Data, Connections>;
  // findAllByIndexValue<K extends keyof IndexQueryInput<Data & Connections>>(
  //   key: K,
  //   value: IndexQueryInput<Data & Connections>[K]
  // ): IObservableArray<Entity<Data, Connections>>;
  findByUniqueIndex<K extends keyof IndexQueryInput<Data & Connections>>(
    key: K,
    value: IndexQueryInput<Data & Connections>[K]
  ): Entity<Data, Connections> | null;
  assertFindByUniqueIndex<K extends keyof IndexQueryInput<Data & Connections>>(
    key: K,
    value: IndexQueryInput<Data & Connections>[K]
  ): Entity<Data, Connections>;

  findById(id: string): Entity<Data, Connections> | null;
  assertFindById(id: string, error?: MessageOrError): Entity<Data, Connections>;
  removeById(id: string, source?: EntityChangeSource): boolean;

  find(filter: EntityFilterInput<Data, Connections>): Entity<Data, Connections>[];
  findFirst(filter: EntityFilterInput<Data, Connections>): Entity<Data, Connections> | null;
}

export interface EntityStore<Data, Connections> extends EntityStoreFindMethods<Data, Connections> {
  items: IObservableArray<Entity<Data, Connections>>;
  add(input: Entity<Data, Connections>, source?: EntityChangeSource): Entity<Data, Connections>;
  events: EntityStoreEventsEmmiter<Data, Connections>;
  definition: EntityDefinition<Data, Connections>;
  destroy: () => void;
}

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
  linker: DatabaseLinker
): EntityStore<Data, Connections> {
  type StoreEntity = Entity<Data, Connections>;

  const { config } = definition;
  /**
   * Keep 2 'versions' of items list. Array and id<>item map for quick 'by id' access.
   */
  const items = observable.array<StoreEntity>([]);
  const itemsMap = observable.object<Record<string, Entity<Data, Connections>>>({});
  // const notAccessableItems = observable.array<StoreEntity>([]);

  // Allow listening to CRUD updates in the store
  const events = createEventsEmmiter<EntityStoreEvents<Data, Connections>>(config.name);

  const queryIndexes = new Map<keyof Data | keyof Connections, QueryIndex<Data, Connections, unknown>>();

  function getEntityId(entity: Entity<Data, Connections>) {
    const id = `${entity[config.keyField]}`;

    return id;
  }

  function getIsEntityAccessable(entity: Entity<Data, Connections>) {
    const { getIsDeleted, accessValidator } = definition.config;

    if (getIsDeleted && !getIsDeleted(entity)) return false;

    if (accessValidator && !accessValidator(entity, linker)) return false;

    return true;
  }

  const getSourceForQueryInput = cachedComputed(
    function getSourceForQueryInput(filter: EntityFilterInput<Data, Connections>): Entity<Data, Connections>[] {
      if (typeof filter === "function") {
        return items.filter(filter);
      }

      const keys = typedKeys(filter);

      if (keys.length === 1) {
        const key = keys[0];
        const value = filter[key];

        const index = mapGetOrCreate(queryIndexes, key, () => createQueryFieldIndex(key, store));

        const results = index.find(value);

        return results;
      }

      let results: Entity<Data, Connections>[] | undefined;

      for (const key of keys) {
        const value = filter[key];
        const index = mapGetOrCreate(queryIndexes, key, () => createQueryFieldIndex(key, store));

        const keyResults = index.find(value);

        if (!results) {
          results = keyResults;
        }

        if (results.length === 0) {
          return results;
        }

        results = results.filter((previouslyPassedResult) => keyResults.includes(previouslyPassedResult));
      }

      return results!;
    },
    { equals: areArraysShallowEqual }
  );

  const cleanups = createCleanupObject();

  const createOrReuseQuery = deepMemoize(
    function createOrReuseQuery(
      filter?: EntityFilterInput<Data, Connections>,
      sort?: EntityQuerySortInput<Data, Connections>
    ) {
      const resolvedSort = resolveSortInput(sort) ?? undefined;

      return createEntityQuery(() => items, { filter: filter, sort: resolvedSort }, store);
    },
    { checkEquality: true }
  );

  function registerEntity(entity: Entity<Data, Connections>, source: EntityChangeSource) {
    const id = getEntityId(entity);
    runInAction(() => {
      items.push(entity);
      itemsMap[id] = entity;
    });
    events.emit("itemAdded", entity, source);
  }

  const reuseEqual = createReuseValueGroup();

  const store: EntityStore<Data, Connections> = {
    definition,
    events,
    items,
    add(entity, source = "user") {
      const isAccessable = getIsEntityAccessable(entity);

      if (isAccessable) {
        registerEntity(entity, source);
      } else {
        const accessCheckCleanup = autorun(() => {
          if (getIsEntityAccessable(entity)) {
            registerEntity(entity, source);
            cleanups.cleanOne(accessCheckCleanup);
          }
        });
        cleanups.next = accessCheckCleanup;
      }

      return entity;
    },
    findById(id) {
      return computed(() => {
        return itemsMap[id];
      }).get();
    },
    assertFindById(id, error) {
      const item = store.findById(id);

      assert(item, error ?? `No item found for id ${id}`);

      return item;
    },
    find(filter) {
      return getSourceForQueryInput(reuseEqual(filter));
    },
    findFirst(filter) {
      const all = getSourceForQueryInput(filter);

      return createArrayFirstComputed(all).get();
    },
    findByUniqueIndex<K extends keyof IndexQueryInput<Data & Connections>>(
      key: K,
      value: IndexQueryInput<Data & Connections>[K]
    ) {
      const index = mapGetOrCreate(queryIndexes, key, () => createQueryFieldIndex(key, store));

      const results = index.find(value);

      if (!results.length) return null;

      if (results.length > 1) console.warn(`Store has multiple items for unique index value ${key}:${value}.`);

      return results[0];
    },
    assertFindByUniqueIndex<K extends keyof IndexQueryInput<Data & Connections>>(
      key: K,
      value: IndexQueryInput<Data & Connections>[K]
    ) {
      const entity = store.findByUniqueIndex(key, value);

      assert(entity, `Assertion error for assertFindByUniqueIndex for key ${key} and value ${value}`);

      return entity;
    },
    removeById(id, source = "user") {
      const entity = itemsMap[id] ?? null;

      if (entity === null) return false;

      let didRemove = false;

      runInAction(() => {
        entity.cleanup.clean();
        didRemove = items.remove(entity);
        delete itemsMap[id];
      });

      events.emit("itemRemoved", entity, source);

      return didRemove;
    },
    query(filter, sort) {
      return createOrReuseQuery(filter, sort);
    },
    sort(sort) {
      return createOrReuseQuery(undefined, sort);
    },
    destroy() {
      cleanups.clean();
      queryIndexes.forEach((queryIndex) => {
        queryIndex.destroy();
      });
    },
  };

  return store;
}
