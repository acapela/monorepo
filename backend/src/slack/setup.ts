import { Express } from "express";

import { slackApp, slackReceiver } from "./app";
import { setupSlackCommands } from "./commands";
import { setupSlackEvents } from "./events";
import { setupSlackOptions } from "./options";

export function setupSlack(app: Express) {
  app.use("/api", slackReceiver.router);

  setupSlackEvents(slackApp);
  setupSlackCommands(slackApp);
  setupSlackOptions(slackApp);
}
