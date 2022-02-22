import { observer } from "mobx-react";
import React from "react";

import { toggleShowShortcutsBar } from "@aca/desktop/actions/settings";
import { applicationWideSettingsBridge } from "@aca/desktop/bridge/system";
import { ActionTrigger } from "@aca/desktop/ui/ActionTrigger";
import { SettingRow } from "@aca/desktop/ui/settings/SettingRow";
import { SettingsList } from "@aca/desktop/ui/settings/SettingsList";
import { Toggle } from "@aca/ui/toggle";

export const GeneralSettings = observer(function ThemeSelector() {
  const { showShortcutsBar } = applicationWideSettingsBridge.get();

  return (
    <SettingsList>
      <SettingRow title="Show shortcuts footer">
        <ActionTrigger action={toggleShowShortcutsBar}>
          <Toggle size="small" isDisabled isSet={showShortcutsBar} />
        </ActionTrigger>
      </SettingRow>
    </SettingsList>
  );
});
