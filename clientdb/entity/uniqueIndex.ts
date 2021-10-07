import { computed, observable, runInAction } from "mobx";

import { Entity } from "~clientdb";

import { EntityStoreEventsEmmiter } from "./store";

export interface UniqueEntityIndex<Data, Connections, K extends keyof Data> {
  destroy(): void;
  find(value: Data[K]): Entity<Data, Connections> | null;
}

/**
 * Will create unique key index for entity store that will automatically add/update/delete items from the index on changes.
 */
export function createUniqueEntityIndex<Data, Connections, K extends keyof Data>(
  key: K,
  events: EntityStoreEventsEmmiter<Data, Connections>
): UniqueEntityIndex<Data, Connections, K> {
  /**
   * Index map. Example: topic has slug. Lets say we have 2 slugs 'foo' and 'bar'.
   *
   * This map would be like:
   * {
   *   foo: entity1,
   *   bar: entity2
   * }
   */
  const observableIndex = observable.map<Data[K], Entity<Data, Connections>>({});

  function getCurrentIndexValue(entity: Data): Data[K] {
    return entity[key];
  }

  function addItemToIndex(entity: Entity<Data, Connections>) {
    const indexValue = getCurrentIndexValue(entity);

    const currentlyIndexedEntity = observableIndex.get(indexValue);

    if (currentlyIndexedEntity && currentlyIndexedEntity !== entity) {
      console.warn(`Multiple items have the same value for unique index. This might lead to unexpected results.`);
    }

    observableIndex.set(indexValue, entity);
  }

  const cancelAdded = events.on("itemAdded", (entity) => {
    runInAction(() => {
      addItemToIndex(entity);
    });
  });

  const cancelUpdated = events.on("itemUpdated", (entity, source, dataBefore) => {
    const indexValueBefore = getCurrentIndexValue(dataBefore);
    const indexValueNow = getCurrentIndexValue(entity);

    if (indexValueBefore === indexValueNow) return;

    runInAction(() => {
      observableIndex.delete(indexValueBefore);
      addItemToIndex(entity);
    });
  });

  const cancelDeleted = events.on("itemRemoved", (entity) => {
    const indexValue = getCurrentIndexValue(entity);

    runInAction(() => {
      observableIndex.delete(indexValue);
    });
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
