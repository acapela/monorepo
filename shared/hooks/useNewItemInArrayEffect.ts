import { useRef } from "react";

import { useDependencyChangeEffect } from "./useChangeEffect";
import { useMethod } from "./useMethod";

type Cleanup = () => void;

export function useNewItemInArrayEffect<T>(
  items: T[],
  keyGetter: (item: T) => string,
  callback: (newItem: T) => Cleanup | void
) {
  const callbackRef = useMethod(callback);
  const keyGetterRef = useMethod(keyGetter);
  const previousItemsRef = useRef(items);
  useDependencyChangeEffect(() => {
    const previousKeys = previousItemsRef.current.map(keyGetterRef);
    const firstNewItem = items.find((item) => {
      const itemKey = keyGetterRef(item);
      return !previousKeys.includes(itemKey);
    });

    if (firstNewItem === undefined) {
      return;
    }

    const maybeCleanup = callbackRef(firstNewItem);

    return () => {
      if (maybeCleanup) {
        maybeCleanup();
      }
      previousItemsRef.current = items;
    };
  }, [items]);
}
