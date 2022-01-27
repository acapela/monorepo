import React from "react";

import { appStateStore } from "@aca/desktop/domains/appStateStore";
import { IconMenu } from "@aca/ui/icons";

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
