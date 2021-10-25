import { Express } from "express";

import { setupSlackActionHandlers } from "./actions";
import { slackApp, slackReceiver } from "./app";
import { setupSlackCommands } from "./commands";
import { setupSlackShortcuts } from "./shortcuts";

export function setupSlack(app: Express) {
  app.use("/api", slackReceiver.router);

  setupSlackShortcuts(slackApp);
  setupSlackCommands(slackApp);
  setupSlackActionHandlers(slackApp);
}
