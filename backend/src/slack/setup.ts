import { createHmac } from "crypto";
import { timingSafeEqual } from "crypto";

import { AnyMiddlewareArgs } from "@slack/bolt";
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
      logger.error(e, "error verifying slack webhook");
      return;
    }

    if (body.type === "event_callback" && !checkEventType(body.event.type)) {
      logger.info(`ignoring slack event: ${body.event.type}`);
      return;
    }

    try {
      await slackApp.processEvent({
        body,
        // webhook was already acknowledged by the hooks service, so we pass only a nop function here
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        ack: async () => {},
        retryNum: headers["x-slack-retry-num"],
        retryReason: headers["x-slack-retry-reason"],
        customProperties: {},
      });
    } catch (e) {
      logger.error(e, "error processing slack webhook");
    }
  });
}

// adapted from https://github.com/slackapi/bolt-js/blob/23cc0e16494c22783222821ebff789cfdaabeebd/src/receivers/ExpressReceiver.ts#L488
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function verifySignatureAndParseBody(signingSecret: string, rawBody: string, headers: any) {
  const {
    "x-slack-signature": signature,
    "x-slack-request-timestamp": requestTimestamp,
    "content-type": contentType,
  } = headers;

  const ts = Number(requestTimestamp);
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(ts)) {
    throw new Error("Slack request signing verification failed. Timestamp is invalid.");
  }

  const hmac = createHmac("sha256", signingSecret);
  const [version, hash] = signature.split("=");
  hmac.update(`${version}:${ts}:${rawBody}`);

  if (!timingSafeEqual(Buffer.from(hash, "hex"), hmac.digest())) {
    throw new Error("Slack request signing verification failed. Signature mismatch.");
  }

  if (contentType === "application/x-www-form-urlencoded") {
    throw new Error("Slack: Content-Type application/x-www-form-urlencoded is not supported.");
  }

  return JSON.parse(rawBody);
}
