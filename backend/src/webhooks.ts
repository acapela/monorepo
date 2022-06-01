import { PubSub } from "@google-cloud/pubsub";
import * as Sentry from "@sentry/node";

import { logger } from "@aca/shared/logger";

import { acquireLock, markAsProcessed, removeMarkAsProcessed } from "./pubsub";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ProcessFunc = (rawBody: string, params: any, headers: any) => Promise<void>;

export function listenForWebhooks(service: string, processFn: ProcessFunc) {
  const pubsub = new PubSub();
  const topicName = `${process.env.STAGE}-webhooks-${service}`;
  const subscription = pubsub.topic(topicName).subscription(`${topicName}-sub`);
  subscription.on("message", async (message) => {
    let lock = null;
    try {
      lock = await acquireLock(service, message.id);
      if (!(await markAsProcessed(service, message.id))) {
        logger.info(`message ${message.id} was already processed`);
        lock.unlock().catch((err) => logger.warn("unlock error (processed)", err));
        return;
      }
      const data = JSON.parse(message.data.toString());
      try {
        await processFn(data.rawBody, data.params, data.headers);
        message.ack();
      } catch (err) {
        logger.error(err);
        Sentry.captureException(err);
        // the messaged could not be processed, unmark it
        await removeMarkAsProcessed(service, message.id);
      }
    } catch (err) {
      logger.error(err);
      Sentry.captureException(err);
    }
    if (lock) lock.unlock().catch((err) => logger.warn("unlock error", err));
  });
  subscription.on("error", (err) => {
    logger.error(err);
    Sentry.captureException(err);
  });
}
