import { IncomingHttpHeaders } from "http";

import { PubSub } from "@google-cloud/pubsub";

import { Service } from "./service";

const pubSubClient = new PubSub();

const stage = process.env.STAGE;
export async function publishWebhook(service: Service, rawBody: string, params: unknown, headers: IncomingHttpHeaders) {
  await pubSubClient.topic(`${stage}-webhooks-${service}`).publishMessage({
    json: {
      rawBody,
      params,
      headers,
    },
  });
}
