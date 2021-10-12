import { IObservableArray, ObservableMap, observable, runInAction } from "mobx";

import { Entity } from "~clientdb";

import { EntityStore } from "./store";
import { computedArray } from "./utils/computedArray";

/**
 * Thunk is a value or lazy getter of that value. It is useful if we don't want to have to eagerly provide some value,
 * but instead calculate it when demanded.
 */
type Thunk<T> = T | (() => T);

function resolveThunk<T>(thunk: Thunk<T>): T {
  if (typeof thunk === "function") {
    return (thunk as () => T)();
  }

  return thunk as T;
}

export type QueryIndexValue<T> = Thunk<T | T[]>;

export interface QueryIndex<Data, Connections, K extends keyof Data> {
  destroy(): void;
  find(value: QueryIndexValue<Data[K]>): Entity<Data, Connections>[];
}

/**
 * Will get existing value or create new one from observable map.
 */
function observableMapGetOrCreate<K, V>(map: ObservableMap<K, V>, key: K, getter: () => V): V {
  if (map.has(key)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return map.get(key)!;
  }

  const newValue = getter();

  map.set(key, newValue);

  return newValue;
}

/**
 * Will create unique key index for entity store that will automatically add/update/delete items from the index on changes.
 */
export function createQueryFieldIndex<Data, Connections, K extends keyof Data>(
  key: K,
  store: EntityStore<Data, Connections>
): QueryIndex<Data, Connections, K> {
  /**
   * Index map. Example: topic has slug. Lets say we have 2 slugs 'foo' and 'bar'.
   *
   * This map would be like:
   * {
   *   foo: entity1,
   *   bar: entity2
   * }
   */
  const observableIndex = observable.map<Data[K], IObservableArray<Entity<Data, Connections>>>({});

  function getCurrentIndexValue(entity: Data): Data[K] {
    return entity[key];
  }

  function addItemToIndex(entity: Entity<Data, Connections>) {
    const indexValue = getCurrentIndexValue(entity);
    const list = observableMapGetOrCreate(observableIndex, indexValue, () => observable.array());

    list.push(entity);
  }

  function populateIndex() {
    runInAction(() => {
      store.items.forEach((entity) => {
        addItemToIndex(entity);
      });
    });
  }

  populateIndex();

  const cancelAdded = store.events.on("itemAdded", (entity) => {
    runInAction(() => {
      addItemToIndex(entity);
    });
  });

  const cancelUpdated = store.events.on("itemUpdated", (entity, dataBefore) => {
    const indexValueBefore = getCurrentIndexValue(dataBefore);
    const indexValueNow = getCurrentIndexValue(entity);

    if (indexValueBefore === indexValueNow) return;

    const listBefore = observableMapGetOrCreate(observableIndex, indexValueBefore, () => observable.array());
    const listNow = observableMapGetOrCreate(observableIndex, indexValueNow, () => observable.array());

    runInAction(() => {
      listBefore.remove(entity);
      listNow.push(entity);
    });
  });

  const cancelDeleted = store.events.on("itemRemoved", (entity) => {
    const indexValue = getCurrentIndexValue(entity);

    const list = observableMapGetOrCreate(observableIndex, indexValue, () => observable.array());

    runInAction(() => {
      list.remove(entity);
    });
  });

  function destroy() {
    cancelAdded();
    cancelUpdated();
    cancelDeleted();
  }

  function findResultsForIndexValue(indexValue: Data[K]) {
    const results = observableIndex.get(indexValue);

    if (!results) return [];

    return results;
  }

  /**
   * In case of single value - eg "foo" will find all entities that have this exact value.
   * In case of array values eg. ["foo", "bar"] will find all entities that has either of those (aka. "or")
   */
  function findResultsForSingleOrMultipleValues(indexValue: QueryIndexValue<Data[K]>) {
    const resolvedIndexValue = resolveThunk(indexValue);
    if (!Array.isArray(resolvedIndexValue)) {
      return findResultsForIndexValue(resolvedIndexValue);
    }

    const results: Entity<Data, Connections>[] = [];

    for (const possibleValue of resolvedIndexValue) {
      const possibleValueResults = findResultsForIndexValue(possibleValue);

      for (const result of possibleValueResults) {
        if (results.includes(result)) continue;
        results.push(result);
      }
    }

    return results;
  }

  function find(indexValue: QueryIndexValue<Data[K]>) {
    return computedArray(() => {
      return findResultsForSingleOrMultipleValues(indexValue);
    }).get();
  }

  return {
    find,
    destroy,
  };
}
