import React from "react";

import { restartAppRequest, toggleDevtoolsRequest } from "@aca/desktop/bridge/system";
import { devSettingsStore } from "@aca/desktop/domains/dev/store";
import { IconKeyboard } from "@aca/ui/icons";

import { requestToggleLoggerWindow } from "../bridge/logger";
import { defineAction } from "./action";
import { defineGroup } from "./action/group";

export const devActionsGroup = defineGroup({
  name: "Developer",
});

const devIcon = <IconKeyboard />;

export const restartElectronAction = defineAction({
  icon: devIcon,
  name: "Restart app",
  group: devActionsGroup,
  shortcut: ["Mod", "Shift", "E"],
  keywords: ["dev", "reload"],
  handler() {
    restartAppRequest();
  },
});

export const toggleDebugFocus = defineAction({
  icon: devIcon,
  name: "Toggle debug focus",
  group: devActionsGroup,
  keywords: ["dev"],
  supplementaryLabel: () => (devSettingsStore.debugFocus ? "Will disable" : "Will enable"),
  handler() {
    devSettingsStore.debugFocus = !devSettingsStore.debugFocus;
  },
});

export const toggleDebugPreloading = defineAction({
  icon: devIcon,
  name: "Toggle debug preloading",
  group: devActionsGroup,
  keywords: ["dev"],
  supplementaryLabel: () => (devSettingsStore.debugPreloading ? "Will disable" : "Will enable"),
  handler() {
    devSettingsStore.debugPreloading = !devSettingsStore.debugPreloading;
  },
});

export const toggleHidePreviews = defineAction({
  icon: devIcon,
  name: "Toggle hide previews",
  group: devActionsGroup,
  keywords: ["dev"],
  supplementaryLabel: () => (devSettingsStore.hidePreviews ? "Will show" : "Will hide"),
  handler() {
    devSettingsStore.hidePreviews = !devSettingsStore.hidePreviews;
  },
});

export const toggleDevtoolsAndMaximize = defineAction({
  icon: devIcon,
  name: "Toggle dev tools and maximize",
  group: devActionsGroup,
  keywords: ["dev"],
  handler() {
    toggleDevtoolsRequest(true);
  },
});

export const toggleDevtools = defineAction({
  icon: devIcon,
  name: "Toggle dev tools",
  group: devActionsGroup,
  keywords: ["dev"],
  handler() {
    toggleDevtoolsRequest(false);
  },
});

export const toggleOpenLoggerWindow = defineAction({
  icon: devIcon,
  name: "Toggle dev logs window",
  group: devActionsGroup,
  handler() {
    requestToggleLoggerWindow();
  },
});
