import React from "react";

import { applicationWideSettingsBridge } from "@aca/desktop/bridge/system";
import { uiSettings } from "@aca/desktop/store/uiSettings";
import { IconChartLine, IconKeyboardHide } from "@aca/ui/icons";

import { defineAction } from "./action";
import { defineGroup } from "./action/group";

export const settingsActionsGroup = defineGroup({
  name: "Settings",
});

export const toggleFocusModeStats = defineAction({
  name: "Toggle focus mode stats",
  group: settingsActionsGroup,
  shortcut: ["Mod", "Shift", "0"],
  supplementaryLabel: () => (uiSettings.showFocusModeStats ? "Will hide" : "Will show"),
  icon: <IconChartLine />,
  handler() {
    uiSettings.showFocusModeStats = !uiSettings.showFocusModeStats;
  },
});

export const toggleShowShortcutsBar = defineAction({
  name: "Toggle show shortcuts bar",
  group: settingsActionsGroup,
  keywords: ["footer", "hide", "ui"],
  icon: <IconKeyboardHide />,
  handler() {
    applicationWideSettingsBridge.update((settings) => {
      settings.showShortcutsBar = !settings.showShortcutsBar;
    });
  },
});
