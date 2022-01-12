import { useEffect, useState } from "react";

import { createTimeout } from "@aca/shared/time";

interface Options<T> {
  onDelay?: number;
  offDelay?: number;
  timeFactory?: (value: T) => number;
}

function defaultTimeFactory<T>(currentValue: T, onDelay: number, offDelay: number) {
  if (currentValue) return onDelay;
  return offDelay;
}

export function useDebouncedValue<T>(
  value: T,
  // Time can be passed as milliseconds or function that returns milliseconds basing on current value
  { onDelay = 0, offDelay = 0, timeFactory }: Options<T>
) {
  const [resolvedValue, setResolvedValue] = useState(value);

  useEffect(() => {
    const debounceTime = timeFactory ? timeFactory(value) : defaultTimeFactory(value, onDelay, offDelay);
    return createTimeout(() => {
      setResolvedValue(value);
    }, debounceTime);
  }, [value, onDelay, offDelay, timeFactory]);

  return resolvedValue;
}
