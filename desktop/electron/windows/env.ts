import { app } from "electron";
import IS_DEV from "electron-is-dev";

import { AppEnvData } from "@aca/desktop/envData";

import { sentryDsn } from "./paths";

export const appEnvData: AppEnvData = {
  appName: app.name,
  sentryDsn: sentryDsn,
  isDev: IS_DEV,
  version: app.getVersion(),
};
