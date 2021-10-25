import * as SlackBolt from "@slack/bolt";

import { createLinkSlackWithAcapelaView, findUserBySlackId } from "./utils";
import { createTopicModalView } from "./views";

export function setupCommands(slackApp: SlackBolt.App) {
  slackApp.command("/" + process.env.SLACK_SLASH_COMMAND, async ({ command, ack, client, context, body }) => {
    const user = await findUserBySlackId(context.botToken || body.token, command.user_id);
    if (!user) {
      await ack();
      await client.views.open(createLinkSlackWithAcapelaView({ triggerId: command.trigger_id }));
      return;
    }

    const slackUserIds = Array.from(body.text.matchAll(/<@(.+?)\|/gm)).map(({ 1: slackUserId }) => slackUserId);
    await ack();
    await client.views.open(
      createTopicModalView({
        triggerId: command.trigger_id,
        messageText: body.text,
        slackUserIds,
        metadata: {
          userId: command.user_id,
          origin: "slack-command",
          channelId: command.channel_id,
          responseURL: command.response_url,
        },
      })
    );
  });
}
