import { BrowserWindow, app } from "electron";
import IS_DEV from "electron-is-dev";
import { runInAction } from "mobx";

import { LogEntry, getAllLogsBridge, logStorage, requestToggleLoggerWindow } from "@aca/desktop/bridge/logger";
import { appState } from "@aca/desktop/electron/appState";
import { getMainWindow } from "@aca/desktop/electron/windows/mainWindow";
import { PRELOAD_SCRIPT_PATH, getEntryHTMLFilePath, sentryDsn } from "@aca/desktop/electron/windows/paths";
import { AppEnvData } from "@aca/desktop/envData";

const allLogs: LogEntry[] = [];

export function InitializeLogger() {
  logStorage.subscribe((entry) => {
    allLogs.push(entry);
  });

  getAllLogsBridge.handle(async () => {
    return allLogs;
  });
  const loggerWindowEnv: AppEnvData = {
    appName: app.name,
    sentryDsn,
    isDev: IS_DEV,
    version: app.getVersion(),
    windowName: "Logger",
  };

  requestToggleLoggerWindow.handle(async () => {
    const { loggerWindow } = appState;

    if (!loggerWindow) {
      const newLoggerWindow = new BrowserWindow({
        parent: getMainWindow(),
        title: "Logger",
        fullscreenable: true,
        webPreferences: {
          contextIsolation: true,
          preload: PRELOAD_SCRIPT_PATH,
          additionalArguments: [JSON.stringify(loggerWindowEnv)],
        },
      });

      newLoggerWindow.loadURL(getEntryHTMLFilePath("index.html"));

      runInAction(() => {
        appState.loggerWindow = newLoggerWindow;
      });
    } else {
      loggerWindow.close();
    }
  });
}
