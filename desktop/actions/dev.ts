import { clearAllDataRequest, restartAppRequest } from "@aca/desktop/bridge/system";

import { defineAction } from "./action";

export const restartElectronAction = defineAction({
  name: "Restart electron app",
  shortcut: ["Mod", "Shift", "D"],
  keywords: ["dev"],
  handler() {
    restartAppRequest();
  },
});

export const restartAndClearElectronData = defineAction({
  name: "Clear all data and restart",
  keywords: ["dev", "bomb", "nuke"],
  shortcut: ["Mod", "Shift", "C"],
  handler() {
    clearAllDataRequest();
  },
});
