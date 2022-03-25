import { app } from "electron";
import IS_DEV from "electron-is-dev";

import { AppEnvData } from "@aca/desktop/envData";

import { getAllPersistedValues } from "../bridgeHandlers/persistance";
import { sentryDsn } from "./paths";

export async function getAppEnvData(): Promise<AppEnvData> {
  const persistedValues = await getAllPersistedValues();

  const appEnvData: AppEnvData = {
    appName: app.name,
    sentryDsn: sentryDsn,
    isDev: IS_DEV,
    version: app.getVersion(),
    initialPersistedValues: persistedValues,
  };

  return appEnvData;
}
