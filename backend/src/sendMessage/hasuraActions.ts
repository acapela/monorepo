import { ActionHandler } from "@aca/backend/src/actions/actionHandlers";
import { sendSlackMessage } from "@aca/backend/src/slack/send";
import { SendMessageInput, SendMessageOutput } from "@aca/gql";
import { assert } from "@aca/shared/assert";

type IntegrationHandler = (userId: string, data: SendMessageInput) => Promise<string | void | undefined | null>;
const supportedIntegrations: { [n: string]: IntegrationHandler } = {
  slack: sendSlackMessage,
};

export const sendMessage: ActionHandler<{ msg: SendMessageInput }, SendMessageOutput> = {
  actionName: "send_message",

  async handle(userId, { msg }) {
    assert(userId, "user id is missing");
    const integrationHandler = supportedIntegrations[msg.integration];
    assert(integrationHandler, `integration ${msg.integration} not supported`);
    const url = await integrationHandler(userId, msg);
    return { url: url || undefined };
  },
};
