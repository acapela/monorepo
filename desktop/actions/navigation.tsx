import React from "react";

import { desktopRouter, getExactIsRouteActive } from "@aca/desktop/routes";
import { uiStore } from "@aca/desktop/store/uiStore";
import { IconArrowLeft, IconCross, IconMenu, IconSlidersHoriz } from "@aca/ui/icons";

import { defineAction } from "./action";
import { defineGroup } from "./action/group";

export const navigationActionsGroup = defineGroup({ name: "Navigation" });

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
