import { IComputedValueOptions } from "mobx";

import { createDeepMap } from "@aca/shared/deepMap";

import { cachedComputedWithoutArgs } from "./cachedComputedWithoutArgs";

export type LazyComputed<T> = {
  get(): T;
  dispose(): void;
};

/**
 * Creates 'lazy computed', but with possibility of using multiple arguments
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cachedComputed<A extends any[], T>(getter: (...args: A) => T, options: IComputedValueOptions<T> = {}) {
  // TODO: cleanup map entries after lazy is disposed
  const map = createDeepMap<LazyComputed<T>>();
  function getComputed(...args: A) {
    return map.get(args, () => cachedComputedWithoutArgs(() => getter(...args), options));
  }

  function getValue(...args: A) {
    return getComputed(...args).get();
  }

  return getValue;
}
