import { isEqual } from "lodash";
import { action, computed } from "mobx";
import { useObserver } from "mobx-react";
import { isPrimitive } from "utility-types";

import { createChannel } from "@aca/shared/channel";
import { lazyBox, runUntracked, serializeUntracked } from "@aca/shared/mobx/utils";
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

function getInitialPersistedValues() {
  if (process.env.ELECTRON_CONTEXT === "client") {
    return window.electronBridge.env.initialPersistedValues;
  } else {
    return global.electronGlobal.appEnvData.get().initialPersistedValues;
  }
}

export function createBridgeValue<T>(valueKey: string, { getDefault, isPersisted }: BridgeValueConfig<T>) {
  type ValueData = ValueWithUpdateDate<T>;

  const localChannel = createChannel<ValueData>();

  function getInitialPersistedValue(): ValueData | null {
    try {
      if (!isPersisted) {
        null;
      }

      const initialPersistedValues = getInitialPersistedValues();
      const maybePersistedValue: ValueWithUpdateDate<T> | undefined = Reflect.get(initialPersistedValues, valueKey);

      if (maybePersistedValue === undefined) {
        return null;
      }

      return maybePersistedValue;
    } catch (error) {
      return null;
    }
  }

  function mixValueWithDefaults(value: T) {
    const defaultValue = getDefault();

    if (isPrimitive(defaultValue)) {
      return value;
    }

    return { ...defaultValue, ...value };
  }

  function getInitialValue(): ValueData {
    const persistedValue = getInitialPersistedValue();

    if (!persistedValue) {
      return {
        updatedAt: null,
        value: getDefault(),
      };
    }

    return {
      updatedAt: persistedValue.updatedAt ? new Date(persistedValue.updatedAt) : null,
      value: persistedValue.value,
    };
  }

  const observableValueData = lazyBox(getInitialValue, { deep: false, equals: isEqual });

  localChannel.subscribe(
    action((value) => {
      observableValueData.set(value);
    })
  );

  bridgeValueChangeChannel.subscribe(({ key, data }) => {
    if (key !== valueKey) return;
    localChannel.publish(data as ValueData);
  });

  async function set(value: T) {
    const serializableValue = serializeUntracked(value);
    if (isEqual(getValue(), value)) {
      return;
    }

    const valueData: ValueData = {
      value: serializableValue,
      updatedAt: new Date(),
    };

    localChannel.publish(valueData);

    bridgeValueChangeChannel.send({ key: valueKey, data: valueData });

    if (isPersisted) {
      await requestPersistValue({ key: valueKey, data: value });
    }
  }

  function update(updater: ValueUpdater<T>) {
    runUntracked(() => {
      const newValue = updateValue(getValue(), updater);

      set(newValue);
    });
  }

  const equalComputed = computed(
    () => {
      const value = observableValueData.get().value;

      return mixValueWithDefaults(value);
    },
    { equals: isEqual }
  );

  function getValue() {
    return equalComputed.get();
  }

  function use() {
    return useObserver(() => getValue());
  }

  function reset() {
    return set(getDefault());
  }

  const valueManager = {
    get lastUpdateDate() {
      return observableValueData.get().updatedAt;
    },
    get: getValue,
    set,
    use,
    update,
    reset,
    get value() {
      return getValue();
    },
  };

  return valueManager;
}

//
