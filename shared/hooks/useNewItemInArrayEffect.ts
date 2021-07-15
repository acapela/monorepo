import { useRef } from "react";
import { useDependencyChangeEffect } from "./useChangeEffect";
import { useMethod } from "./useMethod";

export function useNewItemInArrayEffect<T>(items: T[], callback: (newItem: T) => void) {
  const callbackRef = useMethod(callback);
  const previousItemsRef = useRef(items);
  useDependencyChangeEffect(() => {
    const firstNewItem = items.find((item) => {
      return !previousItemsRef.current.includes(item);
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
