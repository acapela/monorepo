import { observer } from "mobx-react";
import React from "react";

import { applicationWideSettingsBridge } from "@aca/desktop/bridge/system";
import { uiSettingsBridge } from "@aca/desktop/bridge/ui";
import { SettingRow } from "@aca/desktop/ui/settings/SettingRow";
import { SettingsList } from "@aca/desktop/ui/settings/SettingsList";
import { typedKeys } from "@aca/shared/object";
import { SingleOptionDropdown } from "@aca/ui/forms/OptionsDropdown/single";
import { ShortcutPicker } from "@aca/ui/keyboard/ShortcutPicker";

const THEME_LABELS = {
  auto: "Sync with system",
  dark: "Dark",
  light: "Light",
};

export const ExperimentalSettings = observer(function ThemeSelector() {
  const settings = applicationWideSettingsBridge.get();

  return (
    <SettingsList>
      <SettingRow title="Theme">
        <SingleOptionDropdown
          items={typedKeys(THEME_LABELS)}
          selectedItem={uiSettingsBridge.get().theme}
          keyGetter={(k) => k}
          labelGetter={(key) => THEME_LABELS[key]}
          onChange={(theme) => {
            const prev = uiSettingsBridge.get();

            // Avoid 'animated' change where all the buttons might change theme in a slightly different time.
            uiSettingsBridge.set({ ...prev, theme });
          }}
        />
      </SettingRow>
      <SettingRow title="Global shortcut" description="System wide shortcut that will show up Acapela">
        <ShortcutPicker
          currentShortcut={settings.globalShowAppShortcut ?? undefined}
          onChange={(newShortcut) => {
            applicationWideSettingsBridge.update({ globalShowAppShortcut: newShortcut });
          }}
          onClearRequest={() => {
            applicationWideSettingsBridge.update({ globalShowAppShortcut: null });
          }}
        />
      </SettingRow>
      <SettingRow
        title="Peek view shortcut"
        description="System wide shortcut that will show up quick preview of pending notifications"
      >
        <ShortcutPicker
          currentShortcut={settings.globalPeekShortcut ?? undefined}
          onChange={(newShortcut) => {
            applicationWideSettingsBridge.update({ globalPeekShortcut: newShortcut });
          }}
          onClearRequest={() => {
            applicationWideSettingsBridge.update({ globalPeekShortcut: null });
          }}
        />
      </SettingRow>
    </SettingsList>
  );
});
