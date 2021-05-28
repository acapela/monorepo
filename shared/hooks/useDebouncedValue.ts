import { useEffect, useState } from "react";
import { createTimeout } from "~shared/time";

type DebounceTimeFactory<T> = number | ((value: T) => number);

function getDebounceTime<T>(currentValue: T, timeFactory: DebounceTimeFactory<T>) {
  if (typeof timeFactory === "number") return timeFactory;

  return timeFactory(currentValue);
}

export function useDebouncedValue<T>(
  value: T,
  // Time can be passed as milliseconds or function that returns milliseconds basing on current value
  time: number | ((value: T) => number)
) {
  const [resolvedValue, setResolvedValue] = useState(value);

  useEffect(() => {
    const debounceTime = getDebounceTime(value, time);
    return createTimeout(() => {
      setResolvedValue(value);
    }, debounceTime);
  }, [value, time]);

  return resolvedValue;
}
