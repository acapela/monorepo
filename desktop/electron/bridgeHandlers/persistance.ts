import path from "path";

import storage from "electron-json-storage";

import {
  ValueWithUpdateDate,
  requestGetPersistedValue,
  requestPersistValue,
} from "@aca/desktop/bridge/base/persistance";
import { unsafeAssertType } from "@aca/shared/assert";

const PERSISTANCE_DIR = path.resolve(storage.getDefaultDataPath(), "com.acapela.acapela", process.env.STAGE);

export async function clearPersistance() {
  return new Promise<void>((resolve) => {
    storage.clear(() => {
      resolve();
    });
  });
}

export function initializePersistance() {
  storage.setDataPath(PERSISTANCE_DIR);

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
  const persistData: ValueWithUpdateDate<T> = {
    value: value,
    updatedAt: new Date(),
  };
  return new Promise<void>((resolve) => {
    storage.set(key, persistData, () => {
      resolve();
    });
  });
}

///

function getPersistedValue<T>(key: string) {
  return new Promise<ValueWithUpdateDate<T> | null>((resolve) => {
    storage.get(key, (error, value) => {
      unsafeAssertType<ValueWithUpdateDate<T>>(value);

      if (!value) {
        return resolve(null);
      }

      if (!Reflect.has(value, "updatedAt")) {
        return resolve(null);
      }

      return resolve(value);
    });
  });
}
