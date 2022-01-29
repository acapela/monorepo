import { observable } from "mobx";
import { useObserver } from "mobx-react";

import { createChannel } from "@aca/shared/channel";

import { createChannelBridge, createInvokeBridge } from "./channels";

export const requestPersistValue = createInvokeBridge<boolean, { key: string; data: unknown }>("requestPersistValue");
export const requestGetPersistedValue = createInvokeBridge<unknown, string>("requestGetPersistedValue");

export const persistedValueChangeRequestChannel = createChannelBridge<{ key: string; data: unknown }>(
  "persistedValueChangeRequestChannel"
);

export function createElectronPersistedValue<T>(valueKey: string, getDefault: () => T) {
  const localChannel = createChannel<T>();

  const observableValue = observable.box<T>(getDefault());

  const isReady = observable.box(false);

  localChannel.subscribe((value) => {
    observableValue.set(value);
    isReady.set(true);
  });

  setTimeout(() => {
    requestGetPersistedValue(valueKey).then((value) => {
      if (value !== null) {
        localChannel.publish(value as T);
      }
    });
  }, 1);

  persistedValueChangeRequestChannel.subscribe(({ key, data }) => {
    if (key !== valueKey) return;
    localChannel.publish(data as T);
  });

  function set(value: T) {
    localChannel.publish(value);
    requestPersistValue({ key: valueKey, data: value });
    persistedValueChangeRequestChannel.send({ key: valueKey, data: value });
  }

  function get() {
    return observableValue.get();
  }

  function use() {
    return useObserver(() => get());
  }

  return {
    get isReady() {
      return isReady.get();
    },
    get,
    set,
    use,
  };
}
