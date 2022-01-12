import { Maybe } from "@aca/shared/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callback<Args extends any[]> = (...args: Args) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function combineCallbacks<Args extends any[]>(...callbacks: Array<Maybe<Callback<Args>>>): Callback<Args> {
  return function combinedCallback(...args: Args): void {
    for (const callback of callbacks) {
      callback?.(...args);
    }
  };
}
