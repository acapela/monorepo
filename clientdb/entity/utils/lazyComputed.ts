import { IComputedValueOptions, Reaction, observable, runInAction } from "mobx";

import { computedMaybeArray } from "./computedArray";

type ValueBox<T> = { value: T } | null;

export type LazyComputed<T> = {
  get(): T;
  dispose(): void;
};

/**
 * This is version of computed optimized both keeping it cached, but also making it lazy. This is not possible with built in computed (a bit suprising, tho).
 *
 * Lazy - it is not computed, until requested (including if change happens after it was being observed)
 * Kept alive - it is keeping value cached as long as it's dependencies did not change
 *
 * With built-in mobx computed we have either fully lazy value - re computed from scratch each time it is requested after being non-observed at any point.
 * Or 'kept alive' that is running itself eagerly even if not observed at all.
 *
 * Use case example: we might have 'new messages count' in sidebar, but it might not be observed eg during search if you only show 2/100 topics.
 *
 * Then you remove search term and you'll see all topics again - we dont want to re-compute it.
 *
 * But! If eg in search - we dont want to re-compute values for topics that are hidden (even tho we keep their cache alive)
 */
export function lazyComputed<T>(getter: () => T, options?: IComputedValueOptions<T>): LazyComputed<T> {
  // This is the only 'observable' value here. We want to inform observers they need to get computed value again somehow.
  const needsRecomputationIndex = observable.box({});
  // Cached value will be kept as normal variable.
  let cachedValue: ValueBox<T> = null;

  // We use raw Reaction api, as it allows us to have full control of reaction flow.
  const reaction = new Reaction("memoizedComputed", () => {
    // We dont yet tell what the reaction will watch, we only tell what should happen if something it watched is out of date.

    // In such case - clear cache and inform observers that if they want, they need to request it again

    runInAction(() => {
      needsRecomputationIndex.set({});
      cachedValue = null;
    });
  });

  // With this we allow getting either cached or new value and inform reaction we're getting it.
  function getCachedAndTrack(): T {
    if (cachedValue) {
      return cachedValue.value;
    }

    let result: T;

    reaction.track(() => {
      const newValue = getter();
      cachedValue = { value: newValue };
      result = newValue;
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return result!;
  }

  const finalLazyComputed = computedMaybeArray(() => {
    // Use recomputation index so this computed knows cache was cleared
    needsRecomputationIndex.get();
    const result = getCachedAndTrack();

    return result;
  }, options);

  function dispose() {
    reaction.dispose();
  }

  function getMemoized() {
    return finalLazyComputed.get();
  }

  return { get: getMemoized, dispose };
}
