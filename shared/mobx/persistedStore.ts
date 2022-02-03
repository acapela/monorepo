import { isEqual } from "lodash";
import { AnnotationsMap, CreateObservableOptions, autorun, makeAutoObservable } from "mobx";

import { IS_DEV } from "../dev";

// Took from mobx
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NoInfer<T> = [T][T extends any ? 0 : never];

/**
 * It has the same signature as makeAutoObservable, except it also takes persistance key.
 *
 * Will create store that is persisted.
 *
 *
 * Note: Cannot contain anything that is not serializable to JSON!
 * Note: will break server side.
 */
export function createMobxPersistedStore<T extends object, AdditionalKeys extends PropertyKey = never>(
  key: string,
  initial: T,
  overrides?: AnnotationsMap<T, NoInfer<AdditionalKeys>>,
  options?: CreateObservableOptions
): T {
  if (IS_DEV) {
    if (!isEqual(initial, JSON.parse(JSON.stringify(initial)))) {
      console.warn(`createMobxPersistedStore - target not JSON serializable`);
    }
  }
  const fullKey = `mobx-store-${key}`;
  const initialJSON = localStorage.getItem(fullKey);

  const finalValue = initialJSON ? (JSON.parse(initialJSON) as T) : initial;
  const store = makeAutoObservable(finalValue, overrides, options);

  autorun(() => {
    localStorage.setItem(fullKey, JSON.stringify(store));
  });

  return store;
}
