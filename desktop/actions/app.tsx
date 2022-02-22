import React from "react";

import {
  appUpdateAndRestartRequest,
  applicationStateBridge,
  checkForUpdatesRequest,
  toggleFullscreenRequest,
  toggleMaximizeRequest,
} from "@aca/desktop/bridge/system";
import { uiStore } from "@aca/desktop/store/ui";
import { IconArrowsExpand, IconArrowsMove2, IconBox } from "@aca/ui/icons";

import { defineAction } from "./action";
import { defineGroup } from "./action/group";

export const appActionsGroup = defineGroup({
  name: "Application",
});

export const toggleFullscreen = defineAction({
  name: "Toggle fullscreen",
  group: appActionsGroup,
  shortcut: ["Mod", "Shift", "Enter"],
  icon: <IconArrowsExpand />,
  handler() {
    toggleFullscreenRequest();
  },
});
export const toggleMaximize = defineAction({
  name: "Toggle maximize",
  group: appActionsGroup,
  icon: <IconArrowsMove2 />,
  handler() {
    toggleMaximizeRequest();
  },
});

export const installUpdate = defineAction({
  name: "Install update",
  group: appActionsGroup,
  icon: <IconBox />,
  canApply: (context) => context.isContextual || applicationStateBridge.get().isUpdateReadyToInstall,
  handler() {
    appUpdateAndRestartRequest();
  },
});

export const checkForUpdates = defineAction({
  name: "Check for updates",
  group: appActionsGroup,
  icon: <IconBox />,
  handler() {
    checkForUpdatesRequest();
  },
});

/**
 * This is a bit unique case - this is only used for visual indication of this command in shortcuts footer.
 *
 * Command menu opening is not an action itself, as it is something that is running actions.
 */
export const showCommandMenu = defineAction({
  name: "More commands",
  private: true,
  shortcut: ["Mod", "K"],
  canApply: () => !uiStore.isAnyPreviewFocused,
  group: appActionsGroup,
  icon: <IconBox />,
  handler() {
    //
  },
});
