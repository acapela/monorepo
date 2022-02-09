import { BrowserWindow } from "electron";
import { autorun, makeObservable, observable, runInAction } from "mobx";

import { applicationStateBridge } from "@aca/desktop/bridge/system";
import { autorunEffect } from "@aca/shared/mobx/utils";

export const appState = makeObservable(
  {
    mainWindow: null as null | BrowserWindow,
    loggerWindow: null as null | BrowserWindow,
  },
  {
    mainWindow: observable.ref,
    loggerWindow: observable.ref,
  }
);

autorunEffect(() => {
  const { mainWindow } = appState;

  if (!mainWindow) return;

  applicationStateBridge.update({ isFocused: mainWindow.isFocused() });

  const handleFocus = () => {
    applicationStateBridge.update({ isFocused: true });
  };

  const handleBlur = () => {
    applicationStateBridge.update({ isFocused: false });
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
