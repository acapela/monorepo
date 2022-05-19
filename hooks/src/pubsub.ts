import { PubSub } from "@google-cloud/pubsub";

const pubSubClient = new PubSub();

const stage = process.env.STAGE;
export async function publishWebhook(service: string, payload: unknown, params: unknown) {
  await pubSubClient.topic(`${stage}-webhooks-${service}`).publishMessage({
    json: {
      payload,
      params,
    },
  });
}
