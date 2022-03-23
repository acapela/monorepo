import { RefObject, useEffect, useRef } from "react";
import { useUpdate } from "react-use";

export function useRefValue<T>(ref: RefObject<T>) {
  const previousRefValue = useRef(ref.current);
  const forceUpdate = useUpdate();

  useEffect(() => {
    const currentValue = ref.current;
    const previousValue = previousRefValue.current;

    if (currentValue === previousValue) {
      return;
    }

    previousRefValue.current = currentValue;

    forceUpdate();
  });

  return ref.current;
}
