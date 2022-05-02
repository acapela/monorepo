import { IObservableArray, ObservableMap, observable, runInAction, spy } from "mobx";
import { Primitive } from "utility-types";

import { Entity } from "@aca/clientdb";
import { IS_DEV } from "@aca/shared/dev";
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

// Note: spy event type is not exported in mobx, let's pick it from signature spy(listener: (change: SpyEvent) => void): Lambda
type SpyEvent = Parameters<Parameters<typeof spy>[0]>[0];

/**
 * This function will check if given mobx operation reads from other entity than given one.
 * Only reads from current entity are allowed during simple query.
 * Spy event docs - https://mobx.js.org/analyzing-reactivity.html#spy
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function devIsNotReadingFromSelf(event: SpyEvent, entity: Entity<any, any>) {
  // Update operation happens if computed value is calculated.
  if (event.type === "update") {
    /**
     * Entity is reading from itself eg.
     * // task.ts
     * const connections = {
     *   get isOwn() {
     *     return task.user_id === currentUserId
     *   },
     *   get isActionable() {
     *     return connections.isOwn
     *   }
     * }
     *
     * Having such keys in task - reading from both of them is safe, even tho they are computed (but no reading from other entity happens)
     */
    if (event.object === entity) return false;

    /**
     * At any point - we started to read properties from other entity - this is forbidden.
     */
    if (event.object && event.object !== entity) return true;
  }

  // Reaction happens eg. if you create new query inside value getter. This is forbidden.
  // example of created reaction: `new Reaction` in cachedComputedWithoutArgs.ts
  if (event.type === "reaction") return true;

  return false;
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
    if (!IS_DEV) {
      return entity[key];
    }

    /**
     * We'll throw if reading from other entities during getting getting current value.
     *
     * This is unsafe as index only updates is target entity updates, not when its relations are updated.
     *
     * Example: task.hasAssigneeWithNameBob: boolean, then you do task.query({ hasAssigneeWithNameBob: true })
     *
     * In such case, result depends on user entities, not on task entities, thus index can easily become outdated.
     */

    let didReadFromOtherEntities = false;

    // Start spying on mobx before we read data
    const stopSpy = spy((change) => {
      // If any step in reading did read from other entities, report it.
      if (devIsNotReadingFromSelf(change, entity)) {
        didReadFromOtherEntities = true;
      }
    });

    // Finally perform read operation.
    const value = entity[key];

    // TODO: Figure out why this is not working when referring to parent entities
    // Look at figma/comment.ts (connection to `notification`)
    if (didReadFromOtherEntities) {
      console.warn(
        `Forbidden '.query({${key}})' usage on entity "${entity.definition.config.name}". Fields that read from other entities or use queries are not allowed in simple query. Either check "${key}" implementation to avoid such operations or convert ".query({${key}: value})" to ".query((item) => item.${key} === value)"`
      );
    }
    stopSpy();

    return value;
  }

  /**
   * Map keeping info to what index 'page' item currently belongs to
   */
  const currentItemIndexMap = new WeakMap<TargetEntity, IObservableArray<Entity<D, C>>>();

  function updateItemIndex(entity: TargetEntity) {
    // Item might already be indexed somewhere
    const currentIndexList = currentItemIndexMap.get(entity);
    const indexValue = getCurrentIndexValue(entity);
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

  function populateIndex() {
    runInAction(() => {
      store.items.forEach((entity) => {
        updateItemIndex(entity);
      });
    });
  }

  populateIndex();

  const cancelAdded = store.events.on("itemAdded", updateItemIndex);
  const cancelUpdated = store.events.on("itemUpdated", updateItemIndex);
  const cancelDeleted = store.events.on("itemRemoved", removeItemFromIndex);

  function destroy() {
    cancelAdded();
    cancelUpdated();
    cancelDeleted();
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
