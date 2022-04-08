import { app } from "electron";
import IS_DEV from "electron-is-dev";

import { AppEnvData } from "@aca/desktop/envData";

export const appEnvData: AppEnvData = {
  appName: app.name,
  isDev: IS_DEV,
  version: app.getVersion(),
};
