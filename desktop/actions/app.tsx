import React from "react";

import { toggleFullscreenRequest, toggleMaximizeRequest } from "@aca/desktop/bridge/system";
import { IconArrowsExpand, IconArrowsMove2 } from "@aca/ui/icons";

import { defineAction } from "./action";

export const toggleFullscreen = defineAction({
  name: "Toggle fullscreen",
  shortcut: ["Mod", "Shift", "Enter"],
  icon: <IconArrowsExpand />,
  handler() {
    toggleFullscreenRequest();
  },
});
export const toggleMaximize = defineAction({
  name: "Toggle maximize",
  icon: <IconArrowsMove2 />,
  handler() {
    toggleMaximizeRequest();
  },
});
