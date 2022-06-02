import { set } from "lodash";
import { IObservableArray, ObservableMap, observable, observe, runInAction } from "mobx";
import { Primitive } from "utility-types";

import { Entity } from "@aca/clientdb";
import { createCleanupObject } from "@aca/shared/cleanup";
import { Thunk, resolveThunk } from "@aca/shared/thunk";

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

  /**
   * Map keeping info to what index 'page' item currently belongs to
   */
  const currentItemIndexMap = new WeakMap<TargetEntity, IObservableArray<Entity<D, C>>>();

  try {
    set(window, `__index.${store.definition.config.name}.${key}`, { observableIndex });
  } catch (error) {
    //
  }

  function updateItemIndexWithValue(entity: TargetEntity, indexValue: TargetValue) {
    // Item might already be indexed somewhere
    const currentIndexList = currentItemIndexMap.get(entity);
    // Get where it should be indexed now
    const targetIndexList = observableMapGetOrCreate(observableIndex, indexValue, () => observable.array());

    // There is no need to do anything - indexed value did not change
    if (currentIndexList === targetIndexList) return;

    runInAction(() => {
      if (currentIndexList) {
        currentIndexList.remove(entity);
      }
      targetIndexList.push(entity);

      currentItemIndexMap.set(entity, targetIndexList);
    });
  }

  function updateItemIndex(entity: TargetEntity) {
    const indexValue = getCurrentIndexValue(entity);

    updateItemIndexWithValue(entity, indexValue);
  }

  function removeItemFromIndex(entity: TargetEntity) {
    const currentIndexList = currentItemIndexMap.get(entity);

    if (!currentIndexList) {
      console.warn("bad state - trying to remove item from index, but item is not in any index");
      return;
    }

    runInAction(() => {
      currentIndexList.remove(entity);
      currentItemIndexMap.delete(entity);
    });
  }

  const cleanup = createCleanupObject();

  /**
   * There are 2 ways of indexing - it depends on 'key' being used.
   *
   * 1.
   * You can index on built-in keys (raw data of entity). In such case - we don't need to kick in observability at all.
   * We only assume if entity was updated - index might change.
   *
   * 2.
   * You can index on derieved properties, eg. `isResolved` getter that is 'return !!entity.resolved_at
   * or even using some connections or queries.
   *
   * In this case - we'll kick in observability and update index when mobx detects change in getter function.
   * TODO: `isResolved` => entity.resolved_at is technically still built-in - it simply maps raw data so we know it will only change when raw data change (and we know it does not depend on other enties, queries etc)
   *    I did try to approach it with https://mobx.js.org/api.html#getdependencytree but decided it is overkill after measuring performance with current approach.
   */

  // Let's check if index key is built-in key or derieved prop
  const isBasedOnBuiltInKey = store.definition.config.keys.includes(key as keyof D);

  /**
   * Built in key syncing
   */
  function handleBuiltInSyncing() {
    // Populate index
    runInAction(() => {
      store.items.forEach((entity) => {
        updateItemIndex(entity);
      });
    });

    // On raw update/remove/add events simply update index or remove item from index
    cleanup.next = store.events.on("itemAdded", updateItemIndex);
    cleanup.next = store.events.on("itemUpdated", updateItemIndex);
    cleanup.next = store.events.on("itemRemoved", removeItemFromIndex);
  }

  /**
   * Derieved handling
   */

  // We'll make sure we only observe key once per entity. We also need to save cleanup of observing for when entity is removed
  const entityDerievationWatching = new WeakMap<TargetEntity, () => void>();

  function registerEntityForDerievedChanges(entity: TargetEntity) {
    updateItemIndex(entity);
    if (entityDerievationWatching.has(entity)) {
      // Should not happen, but if does - could cause big bottlenecks
      console.warn("Bad state");
      return;
    }

    // Observe entity key using mobx
    // Note - this is lazy so will not be called initially until actual change happens
    const stop = observe(entity, key, (change) => {
      // We can use updateItemIndexWithValue as we know new value in change mobx event. This saves us computing the value twice if it is not cached.
      updateItemIndexWithValue(entity, change.newValue as TargetValue);
    });

    // Save cleanup and mark entity as already observed
    entityDerievationWatching.set(entity, stop);
  }

  function stopWatchingEntityForDerievedChange(entity: TargetEntity) {
    removeItemFromIndex(entity);
    const watchingStop = entityDerievationWatching.get(entity);

    if (!watchingStop) {
      console.warn("Bad state");
      return;
    }

    entityDerievationWatching.delete(entity);

    watchingStop();
  }

  // Initialize derieved index
  function handleDerievedSyncing() {
    runInAction(() => {
      store.items.forEach((entity) => {
        // Populate index with initial values
        updateItemIndex(entity);
        // Start watching using mobx
        registerEntityForDerievedChanges(entity);
      });
    });

    // We only need added/removed item
    cleanup.next = store.events.on("itemAdded", registerEntityForDerievedChanges);
    cleanup.next = store.events.on("itemRemoved", stopWatchingEntityForDerievedChange);
  }

  if (isBasedOnBuiltInKey) {
    handleBuiltInSyncing();
  } else {
    handleDerievedSyncing();
  }

  function destroy() {
    cleanup.clean();
  }

  function findResultsForIndexValue(indexValue: TargetValue) {
    const results = observableIndex.get(indexValue);

    if (!results) {
      return [];
    }

    return results;
  }

  /**
   * In case of single value - eg "foo" will find all entities that have this exact value.
   * In case of array values eg. ["foo", "bar"] will find all entities that has either of those (aka. "or")
   */
  function find(indexValue: TargetValueInput) {
    const resolvedIndexValue = resolveThunk(indexValue);

    if (!Array.isArray(resolvedIndexValue)) {
      return findResultsForIndexValue(resolvedIndexValue);
    }

    return computedArray(() => {
      const results: TargetEntity[] = [];

      for (const possibleValue of resolvedIndexValue) {
        const possibleValueResults = findResultsForIndexValue(possibleValue);

        for (const result of possibleValueResults) {
          if (results.includes(result)) continue;
          results.push(result);
        }
      }

      return results;
    }).get();
  }

  return {
    find,
    destroy,
  };
}
