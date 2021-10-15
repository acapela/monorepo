import { IObservableArray, ObservableMap, observable, runInAction } from "mobx";
import { Primitive } from "utility-types";

import { Entity } from "~clientdb";
import { Thunk, resolveThunk } from "~shared/thunk";

import { EntityStore } from "./store";
import { computedArray } from "./utils/computedArray";

export type IndexQueryInput<I> = Partial<IndexableData<I>>;

type IndexableData<T> = {
  [key in keyof T]: T[key] extends Primitive ? QueryIndexValue<T[key]> : never;
};

export type QueryIndexValue<T> = Thunk<T | T[]>;

export interface QueryIndex<D, C, V> {
  destroy(): void;
  find(value: V): Entity<D, C>[];
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
export function createQueryFieldIndex<D, C, K extends keyof IndexQueryInput<D & C>>(
  key: K,
  store: EntityStore<D, C>
): QueryIndex<D, C, Entity<D, C>[K]> {
  type TargetEntity = Entity<D, C>;
  type TargetValue = TargetEntity[K];
  type TargetValueInput = QueryIndexValue<TargetValue>;

  /**
   * Index map. Example: topic has slug. Lets say we have 2 slugs 'foo' and 'bar'.
   *
   * This map would be like:
   * {
   *   foo: entity1,
   *   bar: entity2
   * }
   */
  const observableIndex = observable.map<TargetValue, IObservableArray<TargetEntity>>({});

  function getCurrentIndexValue(entity: TargetEntity): TargetValue {
    return entity[key];
  }

  function addItemToIndex(entity: TargetEntity) {
    const indexValue = getCurrentIndexValue(entity);
    const list = observableMapGetOrCreate(observableIndex, indexValue, () => observable.array());

    runInAction(() => {
      list.push(entity);
    });
  }

  function removeItemFromIndex(entity: TargetEntity) {
    const indexValue = getCurrentIndexValue(entity);
    const list = observableMapGetOrCreate(observableIndex, indexValue, () => observable.array());
    runInAction(() => {
      list.remove(entity);
    });
  }

  function populateIndex() {
    runInAction(() => {
      store.items.forEach((entity) => {
        addItemToIndex(entity);
      });
    });
  }

  populateIndex();

  const cancelAdded = store.events.on("itemAdded", addItemToIndex);
  const cancelWillUpdate = store.events.on("itemWillUpdate", removeItemFromIndex);
  const cancelUpdated = store.events.on("itemUpdated", addItemToIndex);
  const cancelDeleted = store.events.on("itemRemoved", removeItemFromIndex);

  function destroy() {
    cancelAdded();
    cancelUpdated();
    cancelDeleted();
    cancelWillUpdate();
  }

  function findResultsForIndexValue(indexValue: TargetValue) {
    const results = observableIndex.get(indexValue);
    if (!results) return [];

    return results;
  }

  /**
   * In case of single value - eg "foo" will find all entities that have this exact value.
   * In case of array values eg. ["foo", "bar"] will find all entities that has either of those (aka. "or")
   */
  function findResultsForSingleOrMultipleValues(indexValue: TargetValueInput) {
    const resolvedIndexValue = resolveThunk(indexValue);
    if (!Array.isArray(resolvedIndexValue)) {
      return findResultsForIndexValue(resolvedIndexValue);
    }

    const results: TargetEntity[] = [];

    for (const possibleValue of resolvedIndexValue) {
      const possibleValueResults = findResultsForIndexValue(possibleValue);

      for (const result of possibleValueResults) {
        if (results.includes(result)) continue;
        results.push(result);
      }
    }

    return results;
  }

  function find(indexValue: TargetValueInput) {
    return computedArray(() => {
      return findResultsForSingleOrMultipleValues(indexValue);
    }).get();
  }

  return {
    find,
    destroy,
  };
}
