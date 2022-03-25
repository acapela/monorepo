import { isEqual } from "lodash";
import { action, computed, observable } from "mobx";
import { useObserver } from "mobx-react";
import { isPrimitive } from "utility-types";

import { createChannel } from "@aca/shared/channel";
import { runUntracked, serializeUntracked } from "@aca/shared/mobx/utils";
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

  function getInitialPersistedValue() {
    try {
      if (!isPersisted) {
        return [false, null] as const;
      }

      if (typeof window === "undefined") {
        return [false, null] as const;
      }

      const initialPersistedValues = window.electronBridge.env.initialPersistedValues;
      const maybePersistedValue: ValueWithUpdateDate<T> | undefined = Reflect.get(initialPersistedValues, valueKey);

      if (maybePersistedValue === undefined) {
        return [false, null] as const;
      }

      return [true, maybePersistedValue.value] as const;
    } catch (error) {
      return [false, null] as const;
    }
  }

  function mixValueWithDefaults(value: T) {
    const defaultValue = getDefault();

    if (isPrimitive(defaultValue)) {
      return value;
    }

    return { ...defaultValue, ...value };
  }

  function getInitialValue() {
    const [didGet, maybeValue] = getInitialPersistedValue();

    if (didGet) {
      return mixValueWithDefaults(maybeValue as T);
    }

    return getDefault();
  }

  const observableValueData = observable.box<ValueData>(
    { updatedAt: null, value: getInitialValue() },
    { deep: false, equals: isEqual }
  );

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
