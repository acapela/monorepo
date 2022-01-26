import { action, autorun, untracked } from "mobx";

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
