import { nativeTheme } from "electron";
import { action, autorun, observable } from "mobx";

import { uiSettingsBridge } from "../bridge/ui";

export function initializeDarkModeHandling() {
  autorun(() => {
    const { theme } = uiSettingsBridge.get();

    function getElectronTheme() {
      if (theme === "auto") return "system";

      return theme;
    }

    nativeTheme.themeSource = getElectronTheme();
  });
}

const isDarkModeEnabledBox = observable.box(nativeTheme.shouldUseDarkColors);

nativeTheme.on(
  "updated",
  action(() => {
    isDarkModeEnabledBox.set(nativeTheme.shouldUseDarkColors);
  })
);

export function getObservedDarkMode() {
  return isDarkModeEnabledBox.get();
}
