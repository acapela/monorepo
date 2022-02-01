import React from "react";

import { desktopRouter, getExactIsRouteActive } from "@aca/desktop/routes";
import { uiStore } from "@aca/desktop/store/uiStore";
import { IconArrowLeft, IconCross, IconHome, IconMenu, IconMonitor, IconSlidersHoriz } from "@aca/ui/icons";

import { openLinkRequest } from "../bridge/system";
import { defineAction } from "./action";
import { defineGroup } from "./action/group";

export const navigationActionsGroup = defineGroup({ name: "Navigation" });

export const goToMainScreen = defineAction({
  name: "Go to main screen",
  group: navigationActionsGroup,
  keywords: ["home", "return", "back"],
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
  canApply: () => !getExactIsRouteActive("settings"),
  shortcut: ["Mod", ","],
  handler() {
    desktopRouter.navigate("settings");
  },
});

export const exitSettings = defineAction({
  name: "Exit settings",
  group: navigationActionsGroup,
  icon: <IconArrowLeft />,
  canApply: () => getExactIsRouteActive("settings") && !uiStore.isSidebarOpened,
  shortcut: ["Esc"],
  handler() {
    desktopRouter.navigate("home");
  },
});
