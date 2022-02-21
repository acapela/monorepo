import React from "react";

import { trackingEvent } from "@aca/desktop/analytics";
import { openLinkRequest } from "@aca/desktop/bridge/system";
import { resolvedList, snoozedList } from "@aca/desktop/domains/list/all";
import { desktopRouter, getExactIsRouteActive, getIsRouteActive } from "@aca/desktop/routes";
import { uiStore } from "@aca/desktop/store/ui";
import { settingsSections } from "@aca/desktop/views/SettingsView";
import {
  IconArrowLeft,
  IconClockZzz,
  IconCross,
  IconFolderCheck,
  IconHome,
  IconMenu,
  IconMonitor,
  IconSlidersHoriz,
} from "@aca/ui/icons";

import { defineAction } from "./action";
import { defineGroup } from "./action/group";

export const navigationActionsGroup = defineGroup({ name: "Navigation" });

export const goToMainScreen = defineAction({
  name: "Go to main screen",
  supplementaryLabel: "Inbox",
  group: navigationActionsGroup,
  keywords: ["home", "return", "back"],
  shortcut: ["Mod", "Shift", "H"],
  icon: <IconHome />,
  handler() {
    desktopRouter.navigate("home");
  },
});

export const openAcapelaWebsite = defineAction({
  name: "Open Acapela website",
  group: navigationActionsGroup,
  keywords: ["info", "help", "feedback"],
  icon: <IconMonitor />,
  handler() {
    openLinkRequest({ url: "https://acapela.com" });
  },
});

export const openNavigationMenu = defineAction({
  name: "Toggle navigation menu",
  group: navigationActionsGroup,
  keywords: ["sidebar"],
  shortcut: ["Meta", "/"],
  icon: <IconMenu />,
  handler() {
    uiStore.isSidebarOpened = !uiStore.isSidebarOpened;
  },
});

export const closeNavigationMenu = defineAction({
  name: "Close navigation menu",
  group: navigationActionsGroup,
  keywords: ["sidebar"],
  shortcut: "Esc",
  icon: <IconCross />,
  canApply: () => uiStore.isSidebarOpened,
  handler() {
    uiStore.isSidebarOpened = false;
  },
});

export const goToSettings = defineAction({
  name: "Settings",
  group: navigationActionsGroup,
  icon: <IconSlidersHoriz />,
  analyticsEvent: "Settings Opened",
  keywords: ["options"],
  canApply: () => !getIsRouteActive("settings"),
  shortcut: ["Mod", ","],
  handler() {
    desktopRouter.navigate("settings", { section: settingsSections[0].id });
  },
});

export const goToSettingSectionsActions = settingsSections.map((section) => {
  return defineAction({
    name: "Settings",
    supplementaryLabel: section.label,
    group: navigationActionsGroup,
    icon: <IconSlidersHoriz />,
    keywords: ["options"],
    analyticsEvent: "Settings Opened",
    canApply: () => !getExactIsRouteActive("settings", { section: section.id }),
    handler() {
      desktopRouter.navigate("settings", { section: section.id });
    },
  });
});

export const goToResolved = defineAction({
  name: "Show resolved notifications",
  group: navigationActionsGroup,
  icon: <IconFolderCheck />,
  analyticsEvent: trackingEvent("Resolved Notifications Opened"),
  canApply: () => !getExactIsRouteActive("list", { listId: resolvedList.id }),
  handler() {
    desktopRouter.navigate("list", { listId: resolvedList.id });
  },
});

export const goToSnoozed = defineAction({
  name: "Show snoozed notifications",
  group: navigationActionsGroup,
  icon: <IconClockZzz />,
  analyticsEvent: trackingEvent("Snoozed Notifications Opened"),
  canApply: () => !getExactIsRouteActive("list", { listId: snoozedList.id }),
  handler() {
    desktopRouter.navigate("list", { listId: snoozedList.id });
  },
});

export const exitSettings = defineAction({
  name: "Exit settings",
  group: navigationActionsGroup,
  icon: <IconArrowLeft />,
  canApply: () => getIsRouteActive("settings") && !uiStore.isSidebarOpened,
  shortcut: ["Esc"],
  handler() {
    desktopRouter.navigate("home");
  },
});
