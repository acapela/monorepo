import { observer } from "mobx-react";
import React from "react";

import { toggleDarkTheme } from "@aca/desktop/actions/settings";
import { uiStore } from "@aca/desktop/store/ui";
import { ActionTrigger } from "@aca/desktop/ui/ActionTrigger";
import { SettingRow } from "@aca/desktop/ui/settings/SettingRow";
import { SettingsList } from "@aca/desktop/ui/settings/SettingsList";
import { Toggle } from "@aca/ui/toggle";

import { ShortcutMapping } from "./ShortcutMapping";

export const ExperimentalSettings = observer(function ThemeSelector() {
  const isDarkMode = uiStore.isInDarkMode;

  return (
    <SettingsList>
      <SettingRow title="Dark theme">
        <ActionTrigger action={toggleDarkTheme}>
          <Toggle size="small" isDisabled isSet={isDarkMode} />
        </ActionTrigger>
      </SettingRow>
      <ShortcutMapping />
    </SettingsList>
  );
});
