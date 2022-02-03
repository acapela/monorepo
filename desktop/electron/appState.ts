import { BrowserWindow } from "electron";
import { makeObservable, observable } from "mobx";

import { appWindowValue } from "@aca/desktop/bridge/appWindow";
import { autorunEffect } from "@aca/shared/mobx/utils";

export const appState = makeObservable(
  {
    mainWindow: null as null | BrowserWindow,
  },
  {
    mainWindow: observable.ref,
  }
);

autorunEffect(() => {
  const { mainWindow } = appState;

  if (!mainWindow) return;

  appWindowValue.update({ isFocused: mainWindow.isFocused() });

  const handleFocus = () => {
    appWindowValue.update({ isFocused: true });
  };

  const handleBlur = () => {
    appWindowValue.update({ isFocused: false });
  };

  mainWindow.on("focus", handleFocus);

  mainWindow.on("blur", handleBlur);

  return () => {
    mainWindow.off("focus", handleFocus);

    mainWindow.off("blur", handleBlur);
  };
});
