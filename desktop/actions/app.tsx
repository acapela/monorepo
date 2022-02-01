import React from "react";

import { toggleFullscreenRequest, toggleMaximizeRequest } from "@aca/desktop/bridge/system";
import { IconArrowsExpand, IconArrowsMove2 } from "@aca/ui/icons";

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
