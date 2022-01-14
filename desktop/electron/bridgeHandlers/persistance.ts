import os from "os";

import storage from "electron-json-storage";

import { requestGetPersistedValue, requestPersistValue } from "@aca/desktop/bridge/base/persistance";

export function initializePersistance() {
  storage.setDataPath(os.tmpdir());

  requestPersistValue.handle(async ({ key, data }) => {
    console.info(`Persisting value ${key}`);
    await persistValue(key, data);
    return true;
  });

  requestGetPersistedValue.handle(async (key) => {
    console.info(`Get persisted value ${key}`);
    return getPersistedValue(key);
  });
}

function persistValue<T>(key: string, value: T) {
  return new Promise<void>((resolve) => {
    storage.set(key, value as unknown as object, () => {
      resolve();
    });
  });
}

function getPersistedValue<T>(key: string) {
  return new Promise<T>((resolve) => {
    storage.get(key, (error, value) => {
      resolve(value as unknown as T);
    });
  });
}
