import { Express } from "express";

import { getIndividualSlackInstallURL } from "@aca/backend/src/slack/install";
import { getPublicBackendURL } from "@aca/backend/src/utils";

import { setupSlackCapture } from "../notificationCapture/slack";
import { setupSlackActionHandlers } from "./actions";
import { slackApp, slackReceiver } from "./app";
import { setupCreateRequestModal } from "./create-request-modal";
import { setupDecision } from "./decision";
import { setupHomeTab } from "./home-tab";
import { setupViewRequestModal } from "./view-request-modal";

export function setupSlack(app: Express) {
  app.use("/api", slackReceiver.router);

  app.use("/api/v1/slack/oauth/test", async (req, res) => {
    res.redirect(
      await getIndividualSlackInstallURL({
        userId: "??",
        redirectURL: (await getPublicBackendURL()) + "/v1/slack/oauth/success",
      })
    );
  });
  app.use("/api/v1/slack/oauth/success", (req, res) => {
    res.send("Success! Your workspace can be integrated with Acapela.");
  });

  setupHomeTab(slackApp);

  setupCreateRequestModal(slackApp);

  setupViewRequestModal(slackApp);

  setupSlackActionHandlers(slackApp);

  setupDecision(slackApp);

  setupSlackCapture(slackApp);
}
