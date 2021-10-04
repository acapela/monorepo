import { IObservableArray, computed, observable, runInAction } from "mobx";

import { EntityDefinition } from "./definition";
import { Entity } from "./entity";
import { EntityQuery, EntityQueryConfig, createEntityQuery } from "./query";
import { EntityChangeSource } from "./types";
import { EventsEmmiter, createEventsEmmiter } from "./utils/eventManager";

export type EntityStore<Data, Connections> = {
  items: IObservableArray<Entity<Data, Connections>>;
  findById(id: string): Entity<Data, Connections> | null;
  removeById(id: string, source?: EntityChangeSource): boolean;
  find: (filter: EntityQueryConfig<Data, Connections>) => EntityQuery<Data, Connections>;
  add(input: Entity<Data, Connections>, source?: EntityChangeSource): Entity<Data, Connections>;
  events: EntityStoreEventsEmmiter<Data, Connections>;
  definition: EntityDefinition<Data, Connections>;
};

export type EntityStoreFromDefinition<Definition extends EntityDefinition<unknown, unknown>> =
  Definition extends EntityDefinition<infer Data, infer Connections> ? EntityStore<Data, Connections> : never;

type EntityStoreEvents<Data, Connections> = {
  itemAdded: [Entity<Data, Connections>, EntityChangeSource];
  itemUpdated: [entity: Entity<Data, Connections>, source: EntityChangeSource, dataBefore: Data];
  itemRemoved: [Entity<Data, Connections>, EntityChangeSource];
};

type EntityStoreEventsEmmiter<Data, Connections> = EventsEmmiter<EntityStoreEvents<Data, Connections>>;

/**
 * Store is inner 'registry' of all items of given entity. It is like 'raw' database with no extra logic (like syncing)
 */
export function createEntityStore<Data, Connections>(
  definition: EntityDefinition<Data, Connections>
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

  // Each entity might have 'is deleted' flag which makes is 'as it is not existing' for the store.
  // Let's make sure we always filter such item out.
  const existingItems = computed(() => {
    const { getIsDeleted } = definition.config;
    if (!getIsDeleted) {
      return items;
    }

    return items.filter((item) => !getIsDeleted(item));
  });

  function getExistingItemById(id: string) {
    const item = itemsMap[id];

    if (!item) {
      return null;
    }

    if (definition.config.getIsDeleted?.(item)) {
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
      });

      events.emit("itemAdded", entity, source);

      return entity;
    },
    findById(id) {
      return computed(() => {
        return getExistingItemById(id);
      }).get();
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
    find(config: EntityQueryConfig<Data, Connections>) {
      return createEntityQuery(existingItems.get(), config, definition);
    },
  };

  return store;
}
