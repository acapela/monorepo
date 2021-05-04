import { useState } from "react";

export function useList<T>(initial: T[]) {
  const [items, setItems] = useState(initial);

  function add(item: T) {
    setItems((items) => [...items, item]);
  }

  return { items, add };
}
