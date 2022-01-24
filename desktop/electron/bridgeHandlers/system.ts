import { app } from "electron";

import { restartApp } from "@aca/desktop/bridge/system";

export function initializeSystemHandlers() {
  restartApp.handle(async () => {
    app.relaunch();
    app.exit();
  });
}
