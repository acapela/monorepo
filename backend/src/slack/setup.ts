import { Express } from "express";

import { setupSlackActionHandlers } from "./actions";
import { slackApp, slackReceiver } from "./app";
import { setupRequestModal } from "./create-request-modal";
import { setupHomeTab } from "./home-tab";

export function setupSlack(app: Express) {
  app.use("/api", slackReceiver.router);

  setupHomeTab(slackApp);

  setupRequestModal(slackApp);

  setupSlackActionHandlers(slackApp);
}
