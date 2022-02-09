import { observer } from "mobx-react";
import React from "react";

import { uiSettingsBridge } from "@aca/desktop/bridge/ui";
import { uiStore } from "@aca/desktop/store/ui";
import { SettingRow } from "@aca/desktop/ui/settings/SettingRow";
import { SettingsList } from "@aca/desktop/ui/settings/SettingsList";
import { Toggle } from "@aca/ui/toggle";

import { ShortcutMapping } from "./ShortcutMapping";

export const ExperimentalSettings = observer(function ThemeSelector() {
  const isDarkMode = uiStore.isInDarkMode;

  function handleDarkModeChange(isDarkMode: boolean) {
    const prev = uiSettingsBridge.get();
    uiSettingsBridge.set({ ...prev, isDarkMode });
  }

  return (
    <SettingsList>
      <SettingRow title="Dark mode">
        <Toggle size="small" isSet={isDarkMode} onChange={handleDarkModeChange} />
      </SettingRow>
      <ShortcutMapping />
    </SettingsList>
  );
});
