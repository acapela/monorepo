import React from "react";

import { applicationWideSettingsBridge } from "@aca/desktop/bridge/system";
import { uiSettingsBridge } from "@aca/desktop/bridge/ui";
import { uiStore } from "@aca/desktop/store/ui";
import { uiSettings } from "@aca/desktop/store/uiSettings";
import { IconBulb, IconChartLine, IconKeyboardHide } from "@aca/ui/icons";

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

export const toggleDarkTheme = defineAction({
  name: "Toggle dark theme",
  group: settingsActionsGroup,
  keywords: ["dark mode", "mode"],
  icon: <IconBulb />,
  handler() {
    const newDarkModeValue = !uiStore.isInDarkMode;

    const prev = uiSettingsBridge.get();

    // Avoid 'animated' change where all the buttons might change theme in a slightly different time.
    uiSettingsBridge.set({ ...prev, isDarkMode: newDarkModeValue });
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
