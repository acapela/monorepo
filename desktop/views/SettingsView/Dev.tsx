import { observer } from "mobx-react";
import React from "react";

import { longAction } from "@aca/desktop/actions/dev";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { SettingRow } from "@aca/desktop/ui/settings/SettingRow";
import { SettingsList } from "@aca/desktop/ui/settings/SettingsList";

export const DevSettings = observer(function ThemeSelector() {
  return (
    <SettingsList>
      <SettingRow title="Long action test">
        <ActionButton action={longAction} />
      </SettingRow>
    </SettingsList>
  );
});
