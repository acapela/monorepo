import { App, GlobalShortcut, MessageShortcut } from "@slack/bolt";

import { trackBackendUserEvent } from "~shared/backendAnalytics";

import { createLinkSlackWithAcapelaView, findUserBySlackId } from "./utils";
import { createTopicModalView } from "./views";

const ACAPELA_GLOBAL = { callback_id: "global_acapela", type: "shortcut" } as const as GlobalShortcut;
const ACAPELA_MESSAGE = { callback_id: "message_acapela", type: "message_action" } as const as MessageShortcut;

export function setupShortcuts(slackApp: App) {
  slackApp.shortcut(ACAPELA_GLOBAL, async ({ shortcut, ack, client, body, context }) => {
    await ack();

    const user = await findUserBySlackId(context.botToken || body.token, body.user.id);

    if (!user) {
      await client.views.open(createLinkSlackWithAcapelaView({ triggerId: shortcut.trigger_id }));
      return;
    }

    await client.views.open(
      createTopicModalView({
        triggerId: shortcut.trigger_id,
        messageText: "",
        metadata: { userId: shortcut.user.id, origin: "slack-shortcut" },
      })
    );

    trackBackendUserEvent(user.id, "Used Slack Global Shortcut", { slackUserName: user.name ?? "" });
  });

  slackApp.shortcut(ACAPELA_MESSAGE, async ({ shortcut, ack, client, body, context }) => {
    await ack();

    const user = await findUserBySlackId(context.botToken || body.token, body.user.id);

    if (!user) {
      await client.views.open(createLinkSlackWithAcapelaView({ triggerId: shortcut.trigger_id }));
      return;
    }

    await client.views.open(
      createTopicModalView({
        triggerId: shortcut.trigger_id,
        messageText: shortcut.message.text || "",
        metadata: {
          userId: shortcut.user.id,
          origin: "slack-message-action",
          messageTs: shortcut.message_ts,
          channelId: shortcut.channel.id,
          responseURL: shortcut.response_url,
        },
      })
    );

    trackBackendUserEvent(user.id, "Used Slack Message Action", { slackUserName: user.name ?? "" });
  });
}
