import { Maybe } from "~shared/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callback<R, Args extends any[]> = (...args: Args) => R;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function combineCallbacks<R, Args extends any[]>(
  ...callbacks: Array<Maybe<Callback<R, Args>>>
): Callback<void, Args> {
  return function combinedCallback(...args: Args): void {
    for (const callback of callbacks) {
      callback?.(...args);
    }
  };
}
