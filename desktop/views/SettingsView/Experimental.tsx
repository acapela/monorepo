import { observer } from "mobx-react";
import React from "react";

import { toggleDarkTheme } from "@aca/desktop/actions/settings";
import { applicationWideSettingsBridge } from "@aca/desktop/bridge/system";
import { uiStore } from "@aca/desktop/store/ui";
import { ActionTrigger } from "@aca/desktop/ui/ActionTrigger";
import { SettingRow } from "@aca/desktop/ui/settings/SettingRow";
import { SettingsList } from "@aca/desktop/ui/settings/SettingsList";
import { ShortcutPicker } from "@aca/ui/keyboard/ShortcutPicker";
import { Toggle } from "@aca/ui/toggle";

export const ExperimentalSettings = observer(function ThemeSelector() {
  const isDarkMode = uiStore.isInDarkMode;
  const openShortcut = applicationWideSettingsBridge.get().globalShowAppShortcut;

  return (
    <SettingsList>
      <SettingRow title="Dark theme">
        <ActionTrigger action={toggleDarkTheme}>
          <Toggle size="small" isDisabled isSet={isDarkMode} />
        </ActionTrigger>
      </SettingRow>
      <SettingRow title="Global shortcut" description="System wide shortcut that will show up Acapela">
        <ShortcutPicker
          currentShortcut={openShortcut ?? undefined}
          onChange={(newShortcut) => {
            applicationWideSettingsBridge.update({ globalShowAppShortcut: newShortcut });
          }}
          onClearRequest={() => {
            applicationWideSettingsBridge.update({ globalShowAppShortcut: null });
          }}
        />
      </SettingRow>
    </SettingsList>
  );
});
