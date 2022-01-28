import { action, autorun, observable, untracked } from "mobx";

import { getUUID } from "./uuid";

/**
 * Escape hatch for using mobx observables outside of observers without mobx warning
 */
export function runUntracked<T>(getter: () => T): T {
  const inActionGetter = action(() => untracked(() => getter()));

  return inActionGetter();
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
    busy.set(true);
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
      .then((newValue) => {
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
