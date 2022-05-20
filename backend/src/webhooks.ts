import { PubSub } from "@google-cloud/pubsub";
import * as Sentry from "@sentry/node";

import { logger } from "@aca/shared/logger";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ProcessFunc = (payload: any, params: any) => Promise<void>;

export function listenForWebhooks(service: string, processFn: ProcessFunc) {
  const pubsub = new PubSub();
  const topicName = `${process.env.STAGE}-webhooks-${service}`;
  const subscription = pubsub.topic(topicName).subscription(`${topicName}-sub`);
  subscription.on("message", async (message) => {
    try {
      const data = JSON.parse(message.data.toString());
      await processFn(data.payload, data.params);
      message.ack();
    } catch (err) {
      logger.error(err);
      Sentry.captureException(err);
    }
  });
  subscription.on("error", (err) => {
    logger.error(err);
    Sentry.captureException(err);
  });
}
