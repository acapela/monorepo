import { BrowserWindow } from "electron";
import { autorun, makeAutoObservable, observable, runInAction } from "mobx";

import { applicationFocusStateBridge, applicationStateBridge } from "@aca/desktop/bridge/system";
import { createLogger } from "@aca/shared/log";
import { autorunEffect } from "@aca/shared/mobx/utils";

export const appState = makeAutoObservable(
  {
    mainWindow: null as null | BrowserWindow,
    loggerWindow: null as null | BrowserWindow,
    isMainWindowFocused: false,
  },
  {
    mainWindow: observable.ref,
    loggerWindow: observable.ref,
  }
);

const log = createLogger("App state");

autorunEffect(() => {
  const { mainWindow } = appState;
  appState.isMainWindowFocused = false;

  if (!mainWindow) return;

  applicationStateBridge.update({ isFocused: mainWindow.isFocused() });
  appState.isMainWindowFocused = mainWindow.isFocused();
  applicationFocusStateBridge.update({ lastAppFocusDateTs: Date.now() });

  const handleFocus = () => {
    log("Main window focused");
    applicationStateBridge.update({ isFocused: true });
    appState.isMainWindowFocused = true;

    applicationFocusStateBridge.update({ lastAppFocusDateTs: Date.now() });
  };

  const handleBlur = () => {
    log("Main window blurred");

    applicationStateBridge.update({ isFocused: false });

    applicationFocusStateBridge.update({ lastAppBlurredDateTs: Date.now() });

    appState.isMainWindowFocused = false;
  };

  mainWindow.on("focus", handleFocus);
  mainWindow.on("blur", handleBlur);

  return () => {
    mainWindow.off("focus", handleFocus);

    mainWindow.off("blur", handleBlur);
  };
});

autorun(() => {
  const { loggerWindow } = appState;

  if (!loggerWindow) return;

  const removeLoggerWindow = () => {
    runInAction(() => {
      appState.loggerWindow = null;
    });
  };

  loggerWindow.on("closed", removeLoggerWindow);

  return () => {
    loggerWindow?.off("closed", removeLoggerWindow);
  };
});
