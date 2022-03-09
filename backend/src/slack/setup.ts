import { Express } from "express";

import { getIndividualSlackInstallURL } from "@aca/backend/src/slack/install";
import { getPublicBackendURL } from "@aca/backend/src/utils";

import { slackApp, slackReceiver } from "./app";
import { setupSlackCapture } from "./capture";

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

  setupSlackCapture(slackApp);
}
