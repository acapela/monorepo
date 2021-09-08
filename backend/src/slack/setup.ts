import { Express } from "express";

import { slackApp, slackReceiver } from "./app";
import { setupSlackCommands } from "./commands";
import { setupSlackOptions } from "./options";
import { setupSlackShortcuts } from "./shortcuts";
import { setupSlackViews } from "./views";

export function setupSlack(app: Express) {
  app.use("/api", slackReceiver.router);

  setupSlackViews(slackApp);
  setupSlackShortcuts(slackApp);
  setupSlackCommands(slackApp);
  setupSlackOptions(slackApp);
}
