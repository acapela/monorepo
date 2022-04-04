import { memoize } from "lodash";
import { IObservableArray, autorun, computed, observable, runInAction } from "mobx";

import { MessageOrError, assert } from "@aca/shared/assert";
import { createReuseValueGroup } from "@aca/shared/createEqualReuser";
import { createDeepMap } from "@aca/shared/deepMap";
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
  reuseQueryFilter,
  reuseQuerySort,
} from "./query";
import { IndexQueryInput, QueryIndex, createQueryFieldIndex } from "./queryIndex";
import { EntityChangeSource } from "./types";
import { computedArray } from "./utils/computedArray";
import { EventsEmmiter, createEventsEmmiter } from "./utils/eventManager";

export interface EntityStoreFindMethods<Data, Connections> {
  query: (
    filter: EntityFilterInput<Data, Connections>,
    sort?: EntityQuerySortFunction<Data, Connections>
  ) => EntityQuery<Data, Connections>;
  sort: (sort: EntityQuerySortInput<Data, Connections>) => EntityQuery<Data, Connections>;
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
}

export interface EntityStore<Data, Connections> extends EntityStoreFindMethods<Data, Connections> {
  items: IObservableArray<Entity<Data, Connections>>;
  add(input: Entity<Data, Connections>, source?: EntityChangeSource): Entity<Data, Connections>;
  events: EntityStoreEventsEmmiter<Data, Connections>;
  definition: EntityDefinition<Data, Connections>;
  destroy: () => void;
  simpleQuery(simpleQuery: IndexQueryInput<Data | Connections>): Entity<Data, Connections>[];
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

  // Allow listening to CRUD updates in the store
  const events = createEventsEmmiter<EntityStoreEvents<Data, Connections>>(config.name);

  const queryIndexes = new Map<keyof Data | keyof Connections, QueryIndex<Data, Connections, unknown>>();

  // Each entity might have 'is deleted' flag which makes is 'as it is not existing' for the store.
  // Let's make sure we always filter such item out.
  const existingItems = computedArray(() => {
    return items.filter(getIsEntityAccessable);
  });

  function getIsEntityAccessable(entity: Entity<Data, Connections>) {
    const { getIsDeleted, accessValidator } = definition.config;

    if (getIsDeleted && !getIsDeleted(entity)) return false;

    if (accessValidator && !accessValidator(entity, linker)) return false;

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

  const getSimpleQuery = memoize((input: IndexQueryInput<Data & Connections>) => {
    return computedArray(() => {
      let passingResults: Entity<Data, Connections>[] | null = null;

      for (const requiredKey of typedKeys(input)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const requiredValue = input[requiredKey]!;

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

        passingResults = passingResults.filter((previouslyPassedResult) => keyResults.includes(previouslyPassedResult));
      }

      return passingResults ?? [];
    });
  });

  const reuseQueriesMap = createDeepMap<EntityQuery<Data, Connections>>({ checkEquality: true });

  function createOrReuseQuery(
    filter?: EntityFilterInput<Data, Connections>,
    sort?: EntityQuerySortInput<Data, Connections>
  ) {
    const resolvedSort = resolveSortInput(sort) ?? undefined;
    const reusedFilter = reuseQueryFilter(filter);
    const reusedSort = reuseQuerySort(resolvedSort);
    const query = reuseQueriesMap.get([reusedFilter, reusedSort], () => {
      const query = createEntityQuery(() => existingItems.get(), { filter: reusedFilter, sort: reusedSort }, store);

      return query;
    });

    return query;
  }

  const reuseSimpleQueryInput = createReuseValueGroup();

  const store: EntityStore<Data, Connections> = {
    definition,
    events,
    items,
    add(entity, source = "user") {
      const id = `${entity[config.keyField]}`;

      runInAction(() => {
        items.push(entity);
        itemsMap[id] = entity;

        if (getIsEntityAccessable(entity)) {
          events.emit("itemAdded", entity, source);
        } else {
          const stop = autorun(() => {
            if (getIsEntityAccessable(entity)) {
              stop();
              events.emit("itemAdded", entity, source);
            }
          });
        }
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
    simpleQuery(input: IndexQueryInput<Data & Connections>): Entity<Data, Connections>[] {
      const reusedInput = reuseSimpleQueryInput(input);
      return getSimpleQuery(reusedInput as typeof input).get();
    },
    findByUniqueIndex<K extends keyof IndexQueryInput<Data & Connections>>(
      key: K,
      value: IndexQueryInput<Data & Connections>[K]
    ) {
      const query: IndexQueryInput<Data & Connections> = {};
      // TS was complaining about ^ {[key]: value} as it considered key as string in such case, not as keyof Data
      query[key] = value;

      return computed(() => {
        const results = store.simpleQuery(query);
        if (!results.length) return null;

        if (results.length > 1) console.warn(`Store has multiple items for unique index value ${key}:${value}.`);

        return results[0];
      }).get();
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
      queryIndexes.forEach((queryIndex) => {
        queryIndex.destroy();
      });
    },
  };

  return store;
}
