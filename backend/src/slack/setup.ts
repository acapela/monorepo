import { Express } from "express";

import { setupSlackActionHandlers } from "./actions";
import { slackApp, slackReceiver } from "./app";
import { setupCreateRequestModal } from "./create-request-modal";
import { setupHomeTab } from "./home-tab";
import { setupLiveTopicMessage } from "./live-messages/LiveTopicMessage";
import { setupViewRequestModal } from "./view-request-modal";

export function setupSlack(app: Express) {
  app.use("/api", slackReceiver.router);

  setupHomeTab(slackApp);

  setupCreateRequestModal(slackApp);

  setupViewRequestModal(slackApp);

  setupSlackActionHandlers(slackApp);

  setupLiveTopicMessage(slackApp);
}
