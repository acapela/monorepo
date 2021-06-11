import { useRef } from "react";

type ConstRefValue<T> = null | { value: T };

export function useConst<T>(factory: () => T): T {
  const valueRef = useRef<ConstRefValue<T>>(null);

  if (valueRef.current === null) {
    valueRef.current = { value: factory() };
  }

  return valueRef.current.value;
}
