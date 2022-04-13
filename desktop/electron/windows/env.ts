import { app } from "electron";
import IS_DEV from "electron-is-dev";

import { AppEnvData } from "@aca/desktop/envData";
import { createSyncPromise } from "@aca/shared/promises";

import { getAllPersistedValues } from "../bridgeHandlers/persistanceLoader";

async function getAppEnvData(): Promise<AppEnvData> {
  const persistedValues = await getAllPersistedValues();

  const appEnvData: AppEnvData = {
    appName: app.name,
    isDev: IS_DEV,
    version: app.getVersion(),
    initialPersistedValues: persistedValues,
  };

  return appEnvData;
}

export const appEnvData = createSyncPromise(getAppEnvData);

export const appAndEnvReadyPromise = app.whenReady().then(() => {
  return appEnvData.promise;
});
