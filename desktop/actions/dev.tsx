import { subDays } from "date-fns";
import React from "react";

import { getAllLogsBridge } from "@aca/desktop/bridge/logger";
import { restartAppRequest, showErrorToUserChannel, toggleDevtoolsRequest } from "@aca/desktop/bridge/system";
import { devSettingsStore } from "@aca/desktop/domains/dev/store";
import { uiStore } from "@aca/desktop/store/ui";
import { HOUR } from "@aca/shared/time";
import { IconClock, IconKeyboard } from "@aca/ui/icons";

import { resetSessionBridges } from "../bridge/base/persistance";
import { addToast } from "../domains/toasts/store";
import { desktopRouter } from "../routes";
import { startOnboardingFinishedAnimation } from "../views/OnboardingView/OnboardingFinishedAnimationManager";
import { defineAction } from "./action";
import { defineGroup } from "./action/group";
import { listPageView } from "./views/list";

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

function getIsDevModeEnabled() {
  return devSettingsStore.devMode;
}

export const toggleDevMode = defineAction({
  icon: devIcon,
  name: "Toggle Developer mode",
  group: devActionsGroup,
  keywords: ["dev"],
  supplementaryLabel: () => (devSettingsStore.devMode ? "Will disable" : "Will enable"),
  handler() {
    devSettingsStore.devMode = !devSettingsStore.devMode;
  },
});

export const toggleDebugFocus = defineAction({
  icon: devIcon,
  name: "Toggle debug focus",
  group: devActionsGroup,
  canApply: getIsDevModeEnabled,
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
  canApply: getIsDevModeEnabled,
  keywords: ["dev"],
  supplementaryLabel: () => (devSettingsStore.debugPreloading ? "Will disable" : "Will enable"),
  handler() {
    devSettingsStore.debugPreloading = !devSettingsStore.debugPreloading;
  },
});

export const toggleHidePreviews = defineAction({
  icon: devIcon,
  name: "Toggle hide previews",
  canApply: getIsDevModeEnabled,
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
  canApply: getIsDevModeEnabled,
  group: devActionsGroup,
  keywords: ["dev"],
  handler() {
    toggleDevtoolsRequest(true);
  },
});

export const toggleDevtools = defineAction({
  icon: devIcon,
  name: "Toggle dev tools",
  canApply: getIsDevModeEnabled,
  group: devActionsGroup,
  keywords: ["dev"],
  handler() {
    toggleDevtoolsRequest(false);
  },
});

export const toggleOpenLoggerWindow = defineAction({
  icon: devIcon,
  name: "Toggle dev logs window",
  canApply: getIsDevModeEnabled,
  group: devActionsGroup,
  handler() {
    devSettingsStore.showLogsWindow = !devSettingsStore.showLogsWindow;
  },
});

export const copyLogsIntoClipboard = defineAction({
  icon: devIcon,
  name: "Copy dev logs into clipboard",
  canApply: getIsDevModeEnabled,
  group: devActionsGroup,
  async handler() {
    const logs = await getAllLogsBridge();
    await navigator.clipboard.writeText(
      logs.map((l) => `[${l.timestamp}] ${l.severity} (${l.prefix}): ${l.text}`).join("\n")
    );
  },
});

export const clearAllIntegrations = defineAction({
  icon: devIcon,
  name: "Reset all integrations",
  canApply: getIsDevModeEnabled,
  group: devActionsGroup,
  handler() {
    resetSessionBridges();
  },
});

export const restartOnboarding = defineAction({
  icon: devIcon,
  name: "Show onboarding",
  canApply: getIsDevModeEnabled,
  group: devActionsGroup,
  handler() {
    desktopRouter.navigate("onboarding");
  },
});

export const showOnboardingFinishedAnimation = defineAction({
  icon: devIcon,
  name: "Show onboarding finished animation",
  canApply: getIsDevModeEnabled,
  group: devActionsGroup,
  handler() {
    startOnboardingFinishedAnimation();
  },
});

export const goToLoginView = defineAction({
  icon: devIcon,
  name: "Go to login view",
  canApply: getIsDevModeEnabled,
  group: devActionsGroup,
  handler() {
    desktopRouter.navigate("login");
  },
});

export const showConnectionsOnboarding = defineAction({
  icon: devIcon,
  name: "Show connections onboarding",
  canApply: getIsDevModeEnabled,
  group: devActionsGroup,
  handler() {
    desktopRouter.navigate("connect");
  },
});

export const forceZenMode = defineAction({
  icon: devIcon,
  name: "Force toggle zen mode",
  canApply: getIsDevModeEnabled,
  group: devActionsGroup,
  handler() {
    uiStore.isDisplayingZenImage = !uiStore.isDisplayingZenImage;
  },
});

export const simulateListWasNotSeen = defineAction({
  icon: <IconClock />,
  group: devActionsGroup,

  name: () => "Simulate list was not seen",

  supplementaryLabel: (ctx) => ctx.view(listPageView)?.list.name,

  canApply: (ctx) => getIsDevModeEnabled() && !!ctx.view(listPageView),
  handler(ctx) {
    const { list } = ctx.assertView(listPageView);
    list.listEntity?.update({ seen_at: subDays(new Date(), 180).toISOString() });
  },
});

export const simulateKnownError = defineAction({
  icon: devIcon,
  group: devActionsGroup,
  name: () => "Simulate known error",
  canApply: getIsDevModeEnabled,
  handler() {
    showErrorToUserChannel.send({
      id: "dummy",
      message: "Known test error with lengthy content to test the ui of toast with a lot of text",
    });
  },
});

export const simulateToast = defineAction({
  icon: devIcon,
  group: devActionsGroup,
  name: () => "Simulate toast",
  canApply: getIsDevModeEnabled,
  handler() {
    addToast({
      message: "Some lengthy content to test the ui of toast with a lot of text",
      title: "Test toast",
      durationMs: HOUR,
    });
  },
});
