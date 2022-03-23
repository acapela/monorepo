import { createDeepMap } from "@aca/shared/deepMap";

import { CachedComputedOptions, cachedComputedWithoutArgs } from "./cachedComputedWithoutArgs";

export type LazyComputed<T> = {
  get(): T;
  dispose(): void;
};

/**
 * Creates 'lazy computed', but with possibility of using multiple arguments
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cachedComputed<A extends any[], T>(getter: (...args: A) => T, options: CachedComputedOptions<T> = {}) {
  // For easier debugging - try to get name of getter function
  const getterName = getter.name || undefined;

  // TODO: cleanup map entries after lazy is disposed
  const map = createDeepMap<LazyComputed<T>>();
  function getComputed(...args: A) {
    return map.get(args, () => cachedComputedWithoutArgs(() => getter(...args), { name: getterName, ...options }));
  }

  function getValue(...args: A) {
    return getComputed(...args).get();
  }

  return getValue;
}
