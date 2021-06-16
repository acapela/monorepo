import { MutableRefObject, useMemo } from "react";

type InputRef<T> = ((instance: T | null) => void) | MutableRefObject<T | null> | null;

function createRefWithCallback<T>(initial: T, callback: (value: T) => void) {
  let value = initial;
  const ref: MutableRefObject<T> = {
    get current() {
      return value;
    },
    set current(newValue: T) {
      value = newValue;
      callback(newValue);
    },
  };

  return ref;
}

/**
 * Works like normal useRef, but accepts second argument which is array
 * of additional refs of the same type. Ref value will be shared with
 * all of those provided refs as well
 */
export function useSharedRef<T>(initialValue: T, refsToShare: Array<InputRef<T>>) {
  function publishRef(value: T) {
    refsToShare.forEach((resolvableRef) => {
      // react supports various types of refs
      if (typeof resolvableRef === "function") {
        // if it's functional ref - call it with new value
        resolvableRef(value);
      } else {
        // it should be ref with .current prop
        // make sure it exists - if so - assign new value
        if (resolvableRef) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (resolvableRef as any).current = value;
        }
      }
    });
  }

  const innerRef: MutableRefObject<T> = useMemo(() => {
    return createRefWithCallback(initialValue, publishRef);
  }, [refsToShare]);

  return innerRef;
}
