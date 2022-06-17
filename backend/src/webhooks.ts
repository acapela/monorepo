import { PubSub, Subscription } from "@google-cloud/pubsub";
import * as Sentry from "@sentry/node";
import nr from "newrelic";

import { logger } from "@aca/shared/logger";

import { acquireLock, markAsProcessed, removeMarkAsProcessed } from "./pubsub";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ProcessFunc = (rawBody: string, params: any, headers: any) => Promise<void>;

const allSubscriptions: Subscription[] = [];
export async function closeSubscriptions() {
  for (const subscription of allSubscriptions) {
    logger.info(`closing subscription ${subscription.name}`);
    await subscription.close();
  }
}

export function listenForWebhooks(service: string, processFn: ProcessFunc) {
  const pubsub = new PubSub();
  const topicName = `${process.env.STAGE}-webhooks-${service}`;
  logger.info(`listening for webhooks on topic ${topicName}`);
  const subscription = pubsub.topic(topicName).subscription(`${topicName}-sub`, {
    flowControl: { maxMessages: 10, allowExcessMessages: false },
  });
  subscription.on("message", async (message) => {
    let lock = null;
    let shouldAck = false;
    try {
      lock = await acquireLock(service, message.id);
      if (!(await markAsProcessed(service, message.id))) {
        logger.info(`message ${message.id} from ${service} was already processed`);
        lock.unlock().catch((err) => logger.warn("unlock error (processed)", err));
        // we do not acknowledge the message if it was already processed
        message.nack();
        return;
      }
      const data = JSON.parse(message.data.toString());
      try {
        await nr.startBackgroundTransaction(`process_${service}`, async () =>
          processFn(data.rawBody, data.params, data.headers)
        );
        shouldAck = true;
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
    shouldAck ? message.ack() : message.nack();
    if (lock) lock.unlock().catch((err) => logger.warn("unlock error", err));
  });
  subscription.on("error", (err) => {
    logger.error(err);
    Sentry.captureException(err);
  });
  allSubscriptions.push(subscription);
}
