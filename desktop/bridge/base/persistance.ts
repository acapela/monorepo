import { isEqual } from "lodash";
import { action, computed, observable } from "mobx";
import { useObserver } from "mobx-react";
import { isPrimitive } from "utility-types";

import { createChannel } from "@aca/shared/channel";
import { runUntracked } from "@aca/shared/mobx/utils";
import { ValueUpdater, updateValue } from "@aca/shared/updateValue";

import { createChannelBridge } from "./channels";
import { createInvokeBridge } from "./invoke";

export const requestPersistValue = createInvokeBridge<{ key: string; data: unknown }, boolean>("requestPersistValue");
export const requestGetPersistedValue = createInvokeBridge<string, ValueWithUpdateDate<unknown> | null>(
  "requestGetPersistedValue"
);

export const bridgeValueChangeChannel =
  createChannelBridge<{ key: string; data: ValueWithUpdateDate<unknown> }>("bridgeValueChangeChannel");

export interface ValueWithUpdateDate<T> {
  value: T;
  updatedAt: Date | null;
}

interface BridgeValueConfig<T> {
  getDefault: () => T;
  isPersisted?: boolean;
}

export function createBridgeValue<T>(valueKey: string, { getDefault, isPersisted }: BridgeValueConfig<T>) {
  type ValueData = ValueWithUpdateDate<T>;

  const localChannel = createChannel<ValueData>();

  const observableValueData = observable.box<ValueData>(
    { updatedAt: null, value: getDefault() },
    { deep: false, equals: isEqual }
  );

  const isReady = observable.box(!isPersisted);

  localChannel.subscribe(
    action((value) => {
      observableValueData.set(value);
      isReady.set(true);
    })
  );

  function initialize() {
    if (!isPersisted) {
      return;
    }
    setTimeout(() => {
      requestGetPersistedValue(valueKey).then(
        action((value) => {
          if (value !== null) {
            localChannel.publish(value as ValueData);
          } else {
            isReady.set(true);
          }
        })
      );
    }, 1);
  }

  initialize();

  bridgeValueChangeChannel.subscribe(({ key, data }) => {
    if (key !== valueKey) return;
    localChannel.publish(data as ValueData);
  });

  async function set(value: T) {
    if (isEqual(get(), value)) {
      return;
    }

    const valueData: ValueData = {
      value,
      updatedAt: new Date(),
    };
    localChannel.publish(valueData);

    bridgeValueChangeChannel.send({ key: valueKey, data: valueData });

    if (isPersisted) {
      await requestPersistValue({ key: valueKey, data: value });
    }
  }

  function getWithDefaults() {
    const defaultValue = getDefault();
    const currentValue = observableValueData.get().value;

    if (isPrimitive(defaultValue)) {
      return currentValue;
    }

    return { ...defaultValue, ...currentValue };
  }

  function update(updater: ValueUpdater<T>) {
    runUntracked(() => {
      const newValue = updateValue(get(), updater);

      set(newValue);
    });
  }

  function get() {
    return getWithDefaults();
  }

  function use() {
    return useObserver(() => get());
  }

  function reset() {
    return set(getDefault());
  }

  const valueManager = {
    get isReady() {
      return isReady.get();
    },
    get lastUpdateDate() {
      return observableValueData.get().updatedAt;
    },
    get,
    set,
    use,
    update,
    reset,
    observables: {
      isReady,
      get value() {
        return computed(() => getWithDefaults());
      },
    },
  };

  return valueManager;
}

//
