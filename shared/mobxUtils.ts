import { action } from "mobx";

/**
 * Escape hatch for using mobx observables outside of observers without mobx warning
 */
export function runUntracked<T>(getter: () => T): T {
  const inActionGetter = action(() => getter());

  return inActionGetter();
}
