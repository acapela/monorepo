import { throttle } from "lodash";
import { useState } from "react";

import { createChannel } from "./channel";
import { mapGetOrCreate } from "./map";
import { ValueUpdater, updateValue } from "./updateValue";

type ValueWrapper<T> = { value: T };

interface LocalStorageValueManager<T> {
  get: () => T;
  set: (value: T) => void;
  useValue: () => T;
  clear: () => void;
  update: (updater: ValueUpdater<T>) => void;
}

const PERSISTANCE_THROTTLE_TIME = 300;

function createLocalStorageValueManager<T>(name: string | null, defaultValue: T): LocalStorageValueManager<T> {
  const valueChannel = createChannel<ValueWrapper<T> | null>();

  const storageKey = name ? `__value_${name}` : null;

  function get(): T {
    if (typeof document === "undefined") return defaultValue;
    if (storageKey === null) return valueChannel.getLastValue()?.value ?? defaultValue;

    const rawValue = localStorage.getItem(storageKey);

    if (rawValue === null) return defaultValue;

    return JSON.parse(rawValue) as T;
  }

  function update(updater: ValueUpdater<T>) {
    const currentValue = get();

    const newValue = updateValue(currentValue, updater);

    set(newValue as T);
  }

  function set(value: T) {
    throttledPersist(value);

    valueChannel.publish({ value });
  }

  function persist(value: T) {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(value));
    }
  }

  const throttledPersist = throttle(persist, PERSISTANCE_THROTTLE_TIME);

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
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }

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

/**
 * We keep track of all created persisted values by key and reuse their 'managers'.
 *
 * This ensures that if getting the same persisted value twice (eg in different components), they're always
 * in sync (eg. changing state in one place will also be reflected in the other place)
 */
const localStorageValueManagers = new Map<string | null, LocalStorageValueManager<unknown>>();

export function getLocalStorageValueManager<T>(name: string | null, defaultValue: T): LocalStorageValueManager<T> {
  // Name is nullable - if it is null - we create fake persisted value that is actually not persisted
  if (name === null) {
    // We're not re-using multiple value manages for null as they might not be related at all and we should not keep them in sync
    return createLocalStorageValueManager<T>(name, defaultValue);
  }

  const newOrExistingValueManager = mapGetOrCreate(localStorageValueManagers, name, () =>
    createLocalStorageValueManager<unknown>(name, defaultValue)
  );

  return newOrExistingValueManager as LocalStorageValueManager<T>;
}
