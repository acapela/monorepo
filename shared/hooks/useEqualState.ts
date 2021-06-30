import { isEqual } from "lodash";
import { SetStateAction, useCallback, useState } from "react";

function isStateSetter<T>(action: SetStateAction<T>): action is (old: T) => T {
  return typeof action === "function";
}

type InitialState<S> = S | (() => S);

/**
 * Works the same way as normal useState, except it'll not re-render if new state is equal to the old one.
 *
 * Use case might be something like element size object. You might have new object with the same data.
 *
 * Example:
 *
 * const [state, setState] = useE
 */
export function useEqualState<T>(initial: InitialState<T>) {
  const [value, setValue] = useState(initial);

  const setEqualValue = useCallback((action: SetStateAction<T>) => {
    setValue((oldValue) => {
      if (isStateSetter(action)) {
        const newValue = action(oldValue);

        if (isEqual(oldValue, newValue)) {
          return oldValue;
        }

        return newValue;
      }

      if (isEqual(oldValue, action)) {
        return oldValue;
      }
      return action;
    });
  }, []);

  return [value, setEqualValue] as const;
}
