import { Express } from "express";

import { setupViews } from "~backend/src/slack/views";

import { setupSlackActionHandlers } from "./actions";
import { slackApp, slackReceiver } from "./app";
import { setupCommands } from "./commands";
import { setupShortcuts } from "./shortcuts";

export function setupSlack(app: Express) {
  app.use("/api", slackReceiver.router);

  setupViews(slackApp);
  setupShortcuts(slackApp);
  setupCommands(slackApp);
  setupSlackActionHandlers(slackApp);
}
