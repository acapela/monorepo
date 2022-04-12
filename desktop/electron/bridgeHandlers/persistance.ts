import path from "path";

import storage from "electron-json-storage";

import { requestGetPersistedValue, requestPersistValue } from "@aca/desktop/bridge/base/persistance";

import { getPersistedValue, persistValue } from "./persistanceLoader";

const PERSISTANCE_DIR = path.resolve(storage.getDefaultDataPath(), "com.acapela.acapela", process.env.STAGE);

export async function clearPersistance() {
  return new Promise<void>((resolve) => {
    storage.clear(() => {
      resolve();
    });
  });
}

storage.setDataPath(PERSISTANCE_DIR);

export function initializePersistance() {
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
