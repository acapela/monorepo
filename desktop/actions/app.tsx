import React from "react";

import {
  appUpdateAndRestartRequest,
  applicationStateBridge,
  checkForUpdatesRequest,
  toggleFullscreenRequest,
  toggleMaximizeRequest,
} from "@aca/desktop/bridge/system";
import { openFeedbackWidget } from "@aca/desktop/domains/feedbackWidget";
import { addToast } from "@aca/desktop/domains/toasts/store";
import { desktopRouter } from "@aca/desktop/routes";
import { IconArrowsExpand, IconArrowsMove2, IconBox, IconRefreshCcw, IconSend2 } from "@aca/ui/icons";

import { trackEvent } from "../analytics";
import { forceWorkerSyncRun } from "../bridge/apps";
import { uiStore } from "../store/ui";
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

export const exitFullScreen = defineAction({
  name: "Exit fullscreen",
  group: appActionsGroup,
  shortcut: ["Mod", "Esc"],
  canApply: () => uiStore.isFullscreen,
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
    trackEvent("App Updated");
    appUpdateAndRestartRequest();
  },
});

export const checkForUpdates = defineAction({
  name: "Check for updates",
  group: appActionsGroup,
  icon: <IconBox />,
  async handler() {
    const removeToast = addToast({ title: "App updater", message: "Checking for update..." });
    try {
      await checkForUpdatesRequest();
    } finally {
      removeToast();
    }
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
  group: appActionsGroup,
  icon: <IconBox />,
  handler() {
    //
  },
});

export const forceNotificationsSync = defineAction({
  icon: <IconRefreshCcw />,
  name: "Sync notifications",
  shortcut: ["Mod", "R"],
  canApply: () => desktopRouter.getIsRouteActive("list"),
  group: appActionsGroup,
  async handler() {
    await forceWorkerSyncRun(["notion", "figma"]);

    addToast({ message: "Sent notifications sync request...", durationMs: 2000 });
  },
});

export const sendFeedback = defineAction({
  icon: <IconSend2 />,
  name: "Send feedback",
  shortcut: ["Mod", "Shift", "F"],
  group: appActionsGroup,
  async handler() {
    openFeedbackWidget();
  },
});
