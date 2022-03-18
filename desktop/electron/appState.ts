import { BrowserWindow } from "electron";
import { autorun, makeAutoObservable, observable, runInAction } from "mobx";

export const appState = makeAutoObservable(
  {
    loggerWindow: null as null | BrowserWindow,
    isMainWindowFocused: false,
  },
  {
    loggerWindow: observable.ref,
  }
);

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
