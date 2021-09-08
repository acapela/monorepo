import { useEffect, useRef } from "react";

export function useLastValue<T>(currentValue: T) {
  const valueRef = useRef<T | null>(null);

  useEffect(() => {
    valueRef.current = currentValue;
  });

  return valueRef.current;
}
