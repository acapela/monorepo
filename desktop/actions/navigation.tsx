import React from "react";

import { desktopRouter, getExactIsRouteActive } from "@aca/desktop/routes";
import { uiStore } from "@aca/desktop/store/uiStore";
import { IconCross, IconMenu } from "@aca/ui/icons";

import { defineAction } from "./action";

export const openNavigationMenu = defineAction({
  name: "Toggle navigation menu",
  keywords: ["sidebar"],
  shortcut: ["Meta", "/"],
  icon: <IconMenu />,
  handler() {
    uiStore.isSidebarOpened = !uiStore.isSidebarOpened;
  },
});

export const closeNavigationMenu = defineAction({
  name: "Close navigation menu",
  keywords: ["sidebar"],
  shortcut: "Esc",
  icon: <IconCross />,
  canApply: () => uiStore.isSidebarOpened,
  handler() {
    uiStore.isSidebarOpened = false;
  },
});

export const goToSettings = defineAction({
  // TODO: when we have CMD + K - this can return `Open list...` and result in sub-actions select being opened if no target is set
  name: "Settings",
  canApply: () => !getExactIsRouteActive("settings"),
  shortcut: ["Mod", ","],
  handler() {
    desktopRouter.navigate("settings");
  },
});

export const exitSettings = defineAction({
  // TODO: when we have CMD + K - this can return `Open list...` and result in sub-actions select being opened if no target is set
  name: "Settings",
  canApply: () => getExactIsRouteActive("settings") && !uiStore.isSidebarOpened,
  shortcut: ["Esc"],
  handler() {
    desktopRouter.navigate("home");
  },
});
