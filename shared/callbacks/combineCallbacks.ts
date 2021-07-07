import { Maybe } from "~shared/types";

type Callback<R, Args extends any[]> = (...args: Args) => R;

export function combineCallbacks<R, Args extends any[]>(
  ...callbacks: Array<Maybe<Callback<R, Args>>>
): Callback<void, Args> {
  return function combinedCallback(...args: Args): void {
    for (const callback of callbacks) {
      callback?.(...args);
    }
  };
}
