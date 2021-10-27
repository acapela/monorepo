import { IComputedValueOptions } from "mobx";

import { createDeepMap } from "~shared/deepMap";

import { lazyComputed } from "./lazyComputed";

export type LazyComputed<T> = {
  get(): T;
  dispose(): void;
};

/**
 * This is computed that connect advantages of both 'keepAlive' true and false of normal computed:
 *
 * - we keep cached version even if it is not observed
 * - we keep this lazy meaning value is never re-computed if not requested
 *
 * It provided 'dispose' method, but will also dispose itself automatically if not used for longer than KEEP_ALIVE_TIME_AFTER_UNOBSERVED
 */
export function lazyComputedWithArgs<A extends any[], T>(
  getter: (...args: A) => T,
  options: IComputedValueOptions<T> = {}
) {
  const map = createDeepMap<LazyComputed<T>>();
  function getComputed(...args: A) {
    return map(args, () => lazyComputed(() => getter(...args), options));
  }

  function getValue(...args: A) {
    return getComputed(...args).get();
  }

  return getValue;
}
