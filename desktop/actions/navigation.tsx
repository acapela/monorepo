import React from "react";

import { appStateStore } from "@aca/desktop/domains/appStateStore";
import { IconMenu } from "@aca/ui/icons";

import { desktopRouter, getIsCurrentRoute } from "../routes";
import { defineAction } from "./action";

export const toggleNavigationMenu = defineAction({
  name: "Toggle navigation menu",
  keywords: ["sidebar"],
  shortcut: ["Meta", "/"],
  icon: <IconMenu />,
  handler() {
    appStateStore.isSidebarOpened = !appStateStore.isSidebarOpened;
  },
});

export const goToSettings = defineAction({
  // TODO: when we have CMD + K - this can return `Open list...` and result in sub-actions select being opened if no target is set
  name: "Settings",
  canApply: () => !getIsCurrentRoute("settings"),
  shortcut: ["Mod", ","],
  handler() {
    desktopRouter.navigate("settings");
  },
});

export const exitSettings = defineAction({
  // TODO: when we have CMD + K - this can return `Open list...` and result in sub-actions select being opened if no target is set
  name: "Settings",
  canApply: () => getIsCurrentRoute("settings"),
  shortcut: ["Esc"],
  handler() {
    desktopRouter.navigate("home");
  },
});
