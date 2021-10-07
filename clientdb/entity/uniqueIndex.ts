import { computed, observable } from "mobx";

import { Entity } from "~clientdb";

import { EntityStoreEventsEmmiter } from "./store";

export interface UniqueEntityIndex<Data, Connections, K extends keyof Data> {
  destroy(): void;
  find(value: Data[K]): Entity<Data, Connections> | null;
}

export function createUniqueEntityIndex<Data, Connections, K extends keyof Data>(
  key: K,
  events: EntityStoreEventsEmmiter<Data, Connections>
): UniqueEntityIndex<Data, Connections, K> {
  const observableIndex = observable.map<Data[K], Entity<Data, Connections>>({});

  function getIndexValue(entity: Data): Data[K] {
    return entity[key];
  }

  function addItemToIndex(entity: Entity<Data, Connections>) {
    const indexValue = getIndexValue(entity);

    if (observableIndex.get(indexValue)) {
      console.warn(`Unique index already has value`);
    }

    observableIndex.set(indexValue, entity);
  }

  const cancelAdded = events.on("itemAdded", (entity) => {
    addItemToIndex(entity);
  });

  const cancelUpdated = events.on("itemUpdated", (entity, source, dataBefore) => {
    const indexValueBefore = getIndexValue(dataBefore);
    const indexValueNow = getIndexValue(entity);

    if (indexValueBefore === indexValueNow) return;

    observableIndex.delete(indexValueBefore);

    addItemToIndex(entity);
  });

  const cancelDeleted = events.on("itemRemoved", (entity) => {
    const indexValue = getIndexValue(entity);

    observableIndex.delete(indexValue);
  });

  function destroy() {
    cancelAdded();
    cancelUpdated();
    cancelDeleted();
  }

  function find(indexValue: Data[K]) {
    return computed(() => {
      const entity = observableIndex.get(indexValue);

      return entity ?? null;
    }).get();
  }

  return {
    find,
    destroy,
  };
}
