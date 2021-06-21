import { useState } from "react";
import { createChannel } from "./channel";
import { parseJsonWithDates } from "./dates/parseJSONWithDates";

type ValueWrapper<T> = { value: T };

export function createLocalStorageValueManager<T>(name: string, defaultValue: T) {
  const valueChannel = createChannel<ValueWrapper<T> | null>();

  const storageKey = `__value_${name}`;

  function get() {
    if (typeof document === "undefined") return defaultValue;
    const rawValue = localStorage.getItem(storageKey);

    if (rawValue === null) return defaultValue;

    return parseJsonWithDates<T>(rawValue);
  }

  function set(value: T) {
    localStorage.setItem(storageKey, JSON.stringify(value));

    valueChannel.publish({ value });
  }

  function useValue() {
    const [value, setValue] = useState(get);
    valueChannel.useSubscribe((newValue) => {
      if (newValue === null) {
        setValue(defaultValue);
        return;
      }

      setValue(newValue.value);
    });

    return value;
  }

  function clear() {
    localStorage.removeItem(storageKey);
    valueChannel.publish(null);
  }

  return {
    get,
    set,
    useValue,
    clear,
  };
}
