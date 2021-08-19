import { EntityDefinition } from "./definition";
import { EntityDraft } from "./draft";
import { computed, IObservableArray, makeObservable, observable, runInAction } from "mobx";
import { createEntityQuery, EntityQuery, EntityQueryConfig } from "./query";
import { Entity } from "./entity";

export type EntityStore<Data> = {
  items: IObservableArray<Data>;
  findById(id: string): Entity<Data> | null;
  removeById(id: string): boolean;
  query: (filter?: EntityQueryConfig<Data>) => EntityQuery<Data>;
  add(input: Entity<Data>): Entity<Data>;
};

export function createEntityStore<Data, Connections>(
  definition: EntityDefinition<Data, Connections>
): EntityStore<Data & Connections> {
  type FullData = Data & Connections;
  type StoreEntity = Entity<Data, Connections>;
  const { config } = definition;
  const items = observable.array<StoreEntity>([]);
  const itemsMap = observable.object<Record<string, Entity<Data, Connections>>>({});

  const store: EntityStore<FullData> = {
    items,
    add(entity) {
      const id = config.getId(entity);

      runInAction(() => {
        items.push(entity);
        itemsMap[id] = entity;
      });

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

      return didRemove;
    },
    query(config: EntityQueryConfig<FullData>) {
      return createEntityQuery(items, config);
    },
  };

  return store;
}
