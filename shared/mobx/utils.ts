import {
  CreateObservableOptions,
  IObservableValue,
  action,
  autorun,
  observable,
  reaction,
  runInAction,
  toJS,
  untracked,
} from "mobx";
import { unstable_batchedUpdates } from "react-dom";

import { getUUID } from "@aca/shared/uuid";

import { Effect, createEffect } from "../effect";
import { MaybeCleanup } from "../types";

/**
 * Escape hatch for using mobx observables outside of observers without mobx warning
 */
export function runUntracked<T>(getter: () => T): T {
  const inActionGetter = action(() => untracked(() => getter()));

  return inActionGetter();
}

export function serializeUntracked<T>(item: T): T {
  return runUntracked(() => {
    return toJS(item) as T;
  });
}

type Cleanup = () => void;

export function autorunEffect(callback: () => Cleanup | void) {
  let previousCleanup: Cleanup | void;
  const stop = autorun(() => {
    if (previousCleanup) {
      previousCleanup();
      previousCleanup = undefined;
    }
    previousCleanup = callback();
  });

  return function cancel() {
    if (previousCleanup) {
      previousCleanup();
      previousCleanup = undefined;
    }

    stop();
  };
}

export function reactionEffect<R>(expression: () => R, effect: (value: R) => MaybeCleanup) {
  let effectCleanup: MaybeCleanup;
  const cancelReaction = reaction(expression, (value) => {
    if (effectCleanup) {
      effectCleanup();
    }
    effectCleanup = effect(value);
  });

  return function cancel() {
    cancelReaction();
    effectCleanup?.();
  };
}

interface AsyncComputedCallbackData<T> {
  getStillValid(): boolean;
  assertStillValid(notValidCallback?: () => void): void;
  setSelf(value: T): void;
}

/**
 * This is similar to computed value, but allows computing it in async way and cleaning up.
 *
 * const foo = asyncComputedWithCleanup<Foo | null>(async ({getStillValid, assertStillValid, setSelf}) => {
 *   // ! it is important to read all observable dependencies before any await
 *   const { someValue } = someObservable
 *
 *   await wait(100);
 *
 *   getStillValid(); // true/false depending on if observable deps changed while we were waiting
 *   assertStillValid(); // similar to above, but will throw 'transparent' error so eg. we don't have to return null
 *                       // this error would be silently catch-ed
 *
 *   const someThing = createThing({onRemoveRequest() {
 *     // we can change value from inside
 *     setSelf(null)
 *   }});
 *
 *   return {
 *     // We have to return value and optional cleanup function
 *     value: someThing,
 *     cleanup() {
 *       someThing.destroy()
 *     }
 *   }
 * })
 */
export function asyncComputedWithCleanup<T>(
  creator: (data: AsyncComputedCallbackData<T>) => Promise<{ value: T; cleanup?: () => void }>
) {
  const value = observable.box<T | null>(null);
  const busy = observable.box<boolean>(true);

  let currentRun: string | null = null;

  const InvalidError = new Error("Invalid");

  let currentCleanup: (() => void) | void;

  autorun(() => {
    if (currentCleanup) {
      currentCleanup();
      currentCleanup = undefined;
    }
    runInAction(() => {
      busy.set(true);
    });

    const runId = getUUID();
    currentRun = runId;

    function getStillValid() {
      return currentRun === runId;
    }

    function assertStillValid() {
      if (currentRun !== runId) {
        throw InvalidError;
      }
    }

    function setSelf(newValue: T) {
      value.set(newValue);
    }

    creator({ assertStillValid, setSelf, getStillValid })
      .then(
        action((newValue) => {
          if (!getStillValid()) {
            if (newValue.cleanup) {
              newValue.cleanup();
            }
            return;
          }
          if (newValue.cleanup) {
            currentCleanup = newValue.cleanup;
          }

          value.set(newValue.value);
          busy.set(false);
        })
      )
      .catch((error) => {
        if (error === InvalidError) return;

        return Promise.reject(error);
      });
  });

  return {
    get value() {
      return value.get();
    },
    get busy() {
      return busy.get();
    },
  };
}

function getArrayDiff<T>(itemsNow: T[], itemsBefore: T[], keyGetter?: (item: T) => string) {
  if (keyGetter) {
    const keysNow = itemsNow.map((item) => keyGetter(item));
    const keysBefore = itemsBefore.map((item) => keyGetter(item));

    const addedItems = itemsNow.filter((itemNow) => {
      return !keysBefore.includes(keyGetter(itemNow));
    });

    const removedItems = itemsBefore.filter((itemBefore) => {
      return !keysNow.includes(keyGetter(itemBefore));
    });

    return [addedItems, removedItems] as const;
  }

  const addedItems = itemsNow.filter((itemNow) => {
    return !itemsBefore.includes(itemNow);
  });

  const removedItems = itemsBefore.filter((itemBefore) => {
    return !itemsNow.includes(itemBefore);
  });

  return [addedItems, removedItems] as const;
}

export function mobxWatchAddedAndRemovedItems<T>(
  getter: () => T[],
  callback: (addedItems: T[], removedItems: T[]) => void,
  keyGetter?: (item: T) => string
) {
  const stop = reaction(getter, (itemsNow, itemsBefore) => {
    const [addedItems, removedItems] = getArrayDiff(itemsNow, itemsBefore, keyGetter);

    callback(addedItems, removedItems);
  });

  return () => {
    stop();
  };
}

export function mobxItemAddedToArrayEffect<T>(
  getter: () => T[],
  callback: (item: T) => MaybeCleanup,
  keyGetter?: (item: T) => string
) {
  const effectsMap = new Map<string | T, Effect<[T]>>();

  const stopWatchingArray = mobxWatchAddedAndRemovedItems(
    getter,
    (addedItems, removedItems) => {
      addedItems.forEach((addedItem) => {
        const key = keyGetter?.(addedItem) ?? addedItem;
        const effect = createEffect(callback);

        effectsMap.set(key, effect);

        effect.run(addedItem);
      });

      removedItems.forEach((addedItem) => {
        const key = keyGetter?.(addedItem) ?? addedItem;
        const effect = effectsMap.get(key);

        effect?.clean();

        effectsMap.delete(key);
      });
    },
    keyGetter
  );

  return () => {
    stopWatchingArray();
    effectsMap.forEach((effect, key) => {
      effectsMap.delete(key);
      effect.clean();
    });
  };
}

export function lazyBox<T>(getter: () => T, options?: CreateObservableOptions) {
  let createdBox: IObservableValue<T> | undefined;

  const lazyBox = {
    get() {
      if (!createdBox) {
        createdBox = observable.box(getter(), options);
      }

      return createdBox.get();
    },
    set(value: T) {
      if (!createdBox) {
        createdBox = observable.box(value, options);
        return;
      }

      createdBox.set(value);
    },
  };

  return lazyBox;
}

export function runInBatchedAction(callback: () => void) {
  unstable_batchedUpdates(() => {
    runInAction(() => {
      callback();
    });
  });
}
