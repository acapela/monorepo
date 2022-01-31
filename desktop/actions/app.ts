import { toggleFullscreenRequest } from "@aca/desktop/bridge/system";

import { defineAction } from "./action";

export const toggleFullscreen = defineAction({
  name: "Toggle fullscreen",
  shortcut: ["Mod", "Shift", "Enter"],
  handler() {
    toggleFullscreenRequest();
  },
});
