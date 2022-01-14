import { createChannel } from "@aca/shared/channel";

import { createChannelBridge, createInvokeBridge } from "./channels";

export const requestPersistValue = createInvokeBridge<boolean, { key: string; data: unknown }>("requestPersistValue");
export const requestGetPersistedValue = createInvokeBridge<unknown, string>("requestGetPersistedValue");

export const persistedValueChangeRequestChannel = createChannelBridge<{ key: string; data: unknown }>(
  "persistedValueChangeRequestChannel"
);

export function createElectronPersistedValue<T>(valueKey: string, getDefault: () => T) {
  const localChannel = createChannel<T>();

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
    return localChannel.getLastValue() ?? getDefault();
  }

  function use() {
    return localChannel.useLastValue() ?? getDefault();
  }

  return {
    get,
    set,
    use,
  };
}
