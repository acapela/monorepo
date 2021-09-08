import { IObservableArray, computed, makeObservable, observable } from "mobx";

import { EntityDefinition } from "./definition";
import { EntityDraft } from "./draft";
import { Entity } from "./entity";
import { EntityQuery, EntityQueryConfig, createEntityQuery } from "./query";
import { EventsEmmiter, createEventsEmmiter } from "./utils/eventManager";

export type EntityStore<Data, Connections> = {
  items: IObservableArray<Data>;
  findById(id: string): Entity<Data, Connections> | null;
  removeById(id: string): boolean;
  query: (filter: EntityQueryConfig<Data, Connections>) => EntityQuery<Data, Connections>;
  add(input: Entity<Data, Connections>): Entity<Data, Connections>;
  events: EntityStoreEventsEmmiter<Data, Connections>;
};

export type EntityStoreFromDefinition<Definition extends EntityDefinition<any, any>> =
  Definition extends EntityDefinition<infer Data, infer Connections> ? EntityStore<Data, Connections> : never;

type EntityStoreEvents<Data, Connections> = {
  itemAdded: Entity<Data, Connections>;
  itemUpdated: Entity<Data, Connections>;
  itemRemoved: Entity<Data, Connections>;
};

type EntityStoreEventsEmmiter<Data, Connections> = EventsEmmiter<EntityStoreEvents<Data, Connections>>;

export function createEntityStore<Data, Connections>(
  definition: EntityDefinition<Data, Connections>
): EntityStore<Data, Connections> {
  type StoreEntity = Entity<Data, Connections>;
  const { config } = definition;
  const items = observable.array<StoreEntity>([]);
  const itemsMap = observable.object<Record<string, Entity<Data, Connections>>>({});

  const events = createEventsEmmiter<EntityStoreEvents<Data, Connections>>();

  const store: EntityStore<Data, Connections> = {
    events,
    items,
    add(entity) {
      const id = `${entity[config.keyField]}`;
      items.push(entity);
      itemsMap[id] = entity;

      console.log("elomelo");

      events.emit("itemAdded", entity);

      return entity;
    },
    findById(id) {
      return computed(() => itemsMap[id] ?? null).get();
    },
    removeById(id) {
      const entity = store.findById(id);

      if (entity === null) return false;

      const didRemove = items.remove(entity);
      delete itemsMap[id];

      events.emit("itemRemoved", entity);

      return didRemove;
    },
    query(config: EntityQueryConfig<Data, Connections>) {
      return createEntityQuery(items, config);
    },
  };

  return store;
}
