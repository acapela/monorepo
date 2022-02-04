import { observer } from "mobx-react";
import React from "react";

import { uiSettingsBridge } from "@aca/desktop/bridge/ui";
import { uiStore } from "@aca/desktop/store/uiStore";
import { HStack } from "@aca/ui/Stack";
import { Toggle } from "@aca/ui/toggle";

export const ThemeSelector = observer(function ThemeSelector() {
  const isDarkMode = uiStore.isInDarkMode;

  function handleDarkModeChange(isDarkMode: boolean) {
    const prev = uiSettingsBridge.get();
    uiSettingsBridge.set({ ...prev, isDarkMode });
  }

  return (
    <HStack alignItems="center" gap={10}>
      Dark mode <Toggle size="small" isSet={isDarkMode} onChange={handleDarkModeChange} />
    </HStack>
  );
});
