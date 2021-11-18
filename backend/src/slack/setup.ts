import { Express } from "express";

import { setupSlackActionHandlers } from "./actions";
import { slackApp, slackReceiver } from "./app";
import { setupHomeTab } from "./home-tab";
import { setupRequestModal } from "./request-modal";

export function setupSlack(app: Express) {
  app.use("/api", slackReceiver.router);

  setupHomeTab(slackApp);

  setupRequestModal(slackApp);

  setupSlackActionHandlers(slackApp);
}
