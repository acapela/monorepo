import { useState } from "react";

import { createChannel } from "./channel";
import { getJSONValue, typeSafeParseJSON } from "./dates/parseJSONWithDates";
import { JsonValue } from "./types";
import { ValueUpdater, updateValue } from "./updateValue";

type ValueWrapper<T> = { value: T };

export function createLocalStorageValueManager<T>(name: string, defaultValue: T) {
  // As we store values as JSON, Dates might be lost. Reflect it in type of the results by replacing dates with strings.
  type JSONType = JsonValue<T>;
  const valueChannel = createChannel<ValueWrapper<JSONType> | null>();

  const storageKey = `__value_${name}`;

  const defaultValueJSON = getJSONValue(defaultValue);

  function get(): JSONType {
    if (typeof document === "undefined") return defaultValueJSON;
    const rawValue = localStorage.getItem(storageKey);

    if (rawValue === null) return defaultValueJSON;

    return typeSafeParseJSON<T>(rawValue);
  }

  function update(updater: ValueUpdater<JSONType>) {
    const currentValue = get();

    const newValue = updateValue(currentValue, updater);

    set(newValue as T);
  }

  function set(value: T) {
    localStorage.setItem(storageKey, JSON.stringify(value));

    valueChannel.publish({ value: getJSONValue(value) });
  }

  function useValue() {
    const [value, setValue] = useState(get);
    valueChannel.useSubscribe((newValue) => {
      if (newValue === null) {
        setValue(defaultValueJSON);
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
    update,
  };
}
