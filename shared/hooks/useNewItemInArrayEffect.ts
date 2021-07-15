import { useRef } from "react";
import { useDependencyChangeEffect } from "./useChangeEffect";
import { useMethod } from "./useMethod";

export function useNewItemInArrayEffect<T>(items: T[], keyGetter: (item: T) => string, callback: (newItem: T) => void) {
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

    callbackRef(firstNewItem);

    return () => {
      previousItemsRef.current = items;
    };
  }, [items]);
}
