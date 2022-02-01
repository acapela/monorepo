import { action, observable } from "mobx";
import { useObserver } from "mobx-react";

import { createChannel } from "@aca/shared/channel";
import { ValueUpdater, updateValue } from "@aca/shared/updateValue";

import { createChannelBridge } from "./channels";
import { createInvokeBridge } from "./invoke";

export const requestPersistValue = createInvokeBridge<{ key: string; data: unknown }, boolean>("requestPersistValue");
export const requestGetPersistedValue = createInvokeBridge<string, unknown>("requestGetPersistedValue");

export const bridgeValueChangeChannel = createChannelBridge<{ key: string; data: unknown }>("bridgeValueChangeChannel");

interface BridgeValueConfig<T> {
  getDefault: () => T;
  isPersisted?: boolean;
}

export function createBridgeValue<T>(valueKey: string, { getDefault, isPersisted }: BridgeValueConfig<T>) {
  const localChannel = createChannel<T>();

  const observableValue = observable.box<T>(getDefault());

  const isReady = observable.box(!isPersisted);

  localChannel.subscribe(
    action((value) => {
      observableValue.set(value);
      isReady.set(true);
    })
  );

  function initialize() {
    if (!isPersisted) {
      return;
    }
    setTimeout(() => {
      requestGetPersistedValue(valueKey).then((value) => {
        if (value !== null) {
          localChannel.publish(value as T);
        } else {
          isReady.set(true);
        }
      });
    }, 1);
  }

  initialize();

  bridgeValueChangeChannel.subscribe(({ key, data }) => {
    if (key !== valueKey) return;
    localChannel.publish(data as T);
  });

  function set(value: T) {
    localChannel.publish(value);

    bridgeValueChangeChannel.send({ key: valueKey, data: value });

    if (isPersisted) {
      requestPersistValue({ key: valueKey, data: value });
    }
  }

  function update(updater: ValueUpdater<T>) {
    const newValue = updateValue(get(), updater);

    set(newValue);
  }

  function get() {
    return observableValue.get();
  }

  function use() {
    return useObserver(() => get());
  }

  function reset() {
    return set(getDefault());
  }

  return {
    get isReady() {
      return isReady.get();
    },
    get,
    set,
    use,
    update,
    reset,
  };
}
