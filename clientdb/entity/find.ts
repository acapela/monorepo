import { IObservableArray } from "mobx";

import { typedKeys } from "@aca/shared/object";

import { EntityDefinition } from "./definition";
import { Entity } from "./entity";
import { IndexValueInput } from "./queryIndex";
import { EntityStore } from "./store";

type FindObjectPartInput<T> = Partial<{
  [key in keyof T]: IndexValueInput<T[key]>;
}>;

export type FindObjectInput<T> = FindObjectPartInput<T> & {
  $or?: FindObjectPartInput<T>[];
};

type AnyKeyIndexInput<T> = IndexValueInput<T> extends infer U ? U[keyof U] : never;

type MaybeObservableArray<T> = IObservableArray<T> | T[];

/**
 * Optimized way to pick items that are present in both arrays
 */
function getArraysCommonPart<T extends object>(itemsA: T[], itemsB: T[]) {
  // Use weekset as it has O(1) .has call cost
  const weakA = new WeakSet(itemsA);
  const weakB = new WeakSet(itemsB);

  const results: T[] = [];

  // Iterate on shorter array when comparing
  if (itemsA.length > itemsB.length) {
    for (const itemB of itemsB) {
      if (weakA.has(itemB)) results.push(itemB);
    }
  } else {
    for (const itemA of itemsA) {
      if (weakB.has(itemA)) results.push(itemA);
    }
  }

  return results;
}

function getRemainingItemsAfterApplyingQueryFields<Data, Connections>(
  currentItems: Entity<Data, Connections>[],
  store: EntityStore<Data, Connections>,
  queryObject: FindObjectPartInput<Data & Connections>
) {
  let passingItems = currentItems;

  for (const queryKey of typedKeys(queryObject)) {
    const queryValue = queryObject[queryKey] as AnyKeyIndexInput<Data & Connections>;
    const index = store.getKeyIndex(queryKey);

    const itemsMatchingValue = index.find(queryValue);

    if (itemsMatchingValue.length === 0) return [];

    passingItems = getArraysCommonPart(passingItems, itemsMatchingValue);
  }

  return passingItems;
}

export function findInSourceByObjectInput<Data, Connections>(
  source: MaybeObservableArray<Entity<Data, Connections>>,
  store: EntityStore<Data, Connections>,
  queryObject: FindObjectInput<Data & Connections>
) {
  if (source.length === 0) return [];

  const { $or, ...requiredKeysRaw } = queryObject;

  const itemsMatchingRootQuery = getRemainingItemsAfterApplyingQueryFields(
    source,
    store,
    requiredKeysRaw as FindObjectPartInput<Data & Connections>
  );

  if (!itemsMatchingRootQuery.length) {
    return [];
  }

  if (!$or) {
    return itemsMatchingRootQuery;
  }

  if (!$or.length) {
    return itemsMatchingRootQuery;
  }

  const orQueriesResults = $or.map((orQuery) => {
    return getRemainingItemsAfterApplyingQueryFields(source, store, orQuery);
  });

  return getArraysCommonPart(orQueriesResults.flat(), itemsMatchingRootQuery);
}

type FindFunctionalInput<T> = (item: T) => boolean;

export type FindInput<D, C> = FindObjectInput<D & C> | FindFunctionalInput<Entity<D, C>>;

export type EntityFindInputByDefinition<Def> = Def extends EntityDefinition<infer D, infer C> ? FindInput<D, C> : never;

export function findInSource<Data, Connections>(
  source: MaybeObservableArray<Entity<Data, Connections>>,
  store: EntityStore<Data, Connections>,
  input: FindInput<Data, Connections>
) {
  if (typeof input === "function") {
    // ! Do not pass filter directly as it will break cache (filter pass 3 arguments)
    return source.filter((item) => input(item));
  }

  return findInSourceByObjectInput(source, store, input);
}
