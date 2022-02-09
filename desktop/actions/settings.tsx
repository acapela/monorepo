import React from "react";

import { uiSettings } from "@aca/desktop/store/uiSettings";
import { IconBulb, IconChartLine } from "@aca/ui/icons";

import { uiSettingsBridge } from "../bridge/ui";
import { uiStore } from "../store/ui";
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
  icon: <IconBulb />,
  handler() {
    const newDarkModeValue = !uiStore.isInDarkMode;

    const prev = uiSettingsBridge.get();
    uiSettingsBridge.set({ ...prev, isDarkMode: newDarkModeValue });
  },
});
