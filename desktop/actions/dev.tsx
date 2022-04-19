import { subDays } from "date-fns";
import React from "react";

import { resetAllServices } from "@aca/desktop/bridge/auth";
import { getAllLogsBridge } from "@aca/desktop/bridge/logger";
import { restartAppRequest, showErrorToUserChannel, toggleDevtoolsRequest } from "@aca/desktop/bridge/system";
import { devSettingsStore } from "@aca/desktop/domains/dev/store";
import { uiStore } from "@aca/desktop/store/ui";
import { IconClock, IconKeyboard } from "@aca/ui/icons";

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
    devSettingsStore.showLogsWindow = !devSettingsStore.showLogsWindow;
  },
});

export const copyLogsIntoClipboard = defineAction({
  icon: devIcon,
  name: "Copy dev logs into clipboard",
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
  group: devActionsGroup,
  handler() {
    resetAllServices();
  },
});

export const restartOnboarding = defineAction({
  icon: devIcon,
  name: "Show onboarding",
  group: devActionsGroup,
  handler() {
    desktopRouter.navigate("onboarding");
  },
});

export const showOnboardingFinishedAnimation = defineAction({
  icon: devIcon,
  name: "Show onboarding finished animation",
  group: devActionsGroup,
  handler() {
    startOnboardingFinishedAnimation();
  },
});

export const showConnectionsOnboarding = defineAction({
  icon: devIcon,
  name: "Show connections onboarding",
  group: devActionsGroup,
  handler() {
    desktopRouter.navigate("connect");
  },
});

export const forceZenMode = defineAction({
  icon: devIcon,
  name: "Force toggle zen mode",
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

  canApply: (ctx) => !!ctx.view(listPageView),
  handler(ctx) {
    const { list } = ctx.assertView(listPageView);
    list.listEntity?.update({ seen_at: subDays(new Date(), 180).toISOString() });
  },
});

export const simulateKnownError = defineAction({
  icon: devIcon,
  group: devActionsGroup,
  name: () => "Simulate known error",
  handler() {
    showErrorToUserChannel.send({
      id: "dummy",
      message: "Known test error with lengthy content to test the ui of toast with a lot of text",
    });
  },
});
