import { nativeTheme } from "electron";
import { autorun } from "mobx";

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
