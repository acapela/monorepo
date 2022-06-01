import { AnyMiddlewareArgs } from "@slack/bolt";
import { verifySignatureAndParseBody } from "@slack/bolt/dist/receivers/ExpressReceiver";
import { Express } from "express";

import { getIndividualSlackInstallURL } from "@aca/backend/src/slack/install";
import { getPublicBackendURL } from "@aca/backend/src/utils";
import { listenForWebhooks } from "@aca/backend/src/webhooks";
import { logger } from "@aca/shared/logger";

import { sharedOptions, slackApp, slackReceiver } from "./app";
import { setupSlackCapture } from "./capture";

export function setupSlack(app: Express) {
  app.use("/api/slack", slackReceiver.router);

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

  // this function is used to prefilter event types before passing them to bolt
  function checkEventType(type: string) {
    let matches = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (slackApp as any).listeners.forEach((l: any) => l[1]({ event: { type }, next: () => matches++ }));
    return matches > 0;
  }

  // listen for slack events
  listenForWebhooks("slack", async function (rawBody: string, params, headers) {
    if (params.id !== "events") {
      logger.error("invalid slack event id", params);
      return;
    }
    let body: AnyMiddlewareArgs["body"];
    try {
      body = verifySignatureAndParseBody(sharedOptions.signingSecret, rawBody, headers);
    } catch (e) {
      logger.error(e, "Error verifying slack webhook");
      return;
    }

    if (body.type === "event_callback" && !checkEventType(body.event.type)) {
      logger.info(`ignoring slack event: ${body.event.type}`);
      return;
    }

    await slackApp.processEvent({
      body,
      // webhook was already acknowledged by the hooks service, so we pass only a nop function here
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      ack: async () => {},
      retryNum: headers["x-slack-retry-num"],
      retryReason: headers["x-slack-retry-reason"],
      customProperties: {},
    });
  });
}
