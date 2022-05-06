import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";

import { createTimeout } from "@aca/shared/time";

interface DebouncedBooleanOptions {
  onDelay?: number;
  offDelay?: number;
}

export function useDebouncedBoolean(
  value: boolean,
  // Time can be passed as milliseconds or function that returns milliseconds basing on current value
  { onDelay = 0, offDelay = 0 }: DebouncedBooleanOptions
) {
  const [resolvedValue, setResolvedValue] = useState(value);

  useEffect(() => {
    const debounceTime = value ? onDelay : offDelay;
    return createTimeout(() => {
      setResolvedValue(value);
    }, debounceTime);
  }, [value, onDelay, offDelay]);

  return resolvedValue;
}

type DebouncedValueTimeInput<T> = number | ((value: T) => number);

export function useDebouncedValue<T>(value: T, time: DebouncedValueTimeInput<T>) {
  const [resolvedValue, setResolvedValue] = useState(value);

  useEffect(() => {
    const debounceTime = typeof time === "number" ? time : time(value);
    return createTimeout(() => {
      setResolvedValue(value);
    }, debounceTime);
  }, [value, time]);

  return resolvedValue;
}

export function useLeadingDebouncedValue<T>(value: T, timeMs: number) {
  const [currentValue, setCurrentValue] = useState(value);

  const setCurrentValueDebounced = useCallback(
    debounce((newValue: T) => setCurrentValue(newValue), timeMs, { leading: true }),
    [timeMs]
  );

  useEffect(() => {
    setCurrentValueDebounced(value);
  }, [currentValue, value]);

  return currentValue;
}
