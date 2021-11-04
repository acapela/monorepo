import { Express } from "express";

import { setupHomeTab } from "~backend/src/slack/home-tab";

import { setupSlackActionHandlers } from "./actions";
import { slackApp, slackReceiver } from "./app";
import { setupRequestModal } from "./request-modal";

export function setupSlack(app: Express) {
  app.use("/api", slackReceiver.router);

  setupHomeTab(slackApp);

  setupRequestModal(slackApp);

  setupSlackActionHandlers(slackApp);
}
