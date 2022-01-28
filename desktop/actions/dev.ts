import { requestRestartApp } from "@aca/desktop/bridge/system";

import { defineAction } from "./action";

export const restartElectronAction = defineAction({
  name: "Restart electron app",
  shortcut: ["Mod", "Shift", "D"],
  handler() {
    requestRestartApp();
  },
});

export const restartAndClearElectronData = defineAction({
  name: "Clear all data and restart",
  shortcut: ["Mod", "Shift", "C"],
  handler() {
    requestRestartApp();
  },
});
