import * as SlackBolt from "@slack/bolt";

// import { db } from "~db";

export function setupSlackEvents(slackApp: SlackBolt.App) {
  slackApp.shortcut({ callback_id: "message_acapela", type: "message_action" }, async ({ shortcut, ack, client }) => {
    try {
      // Acknowledge shortcut request
      await ack();
      // console.info(shortcut);
      // Call the views.open method using one of the built-in WebClients
      const result = await client.views.open({
        trigger_id: shortcut.trigger_id,
        view: {
          type: "modal",
          title: {
            type: "plain_text",
            text: "My App",
          },
          close: {
            type: "plain_text",
            text: "Close",
          },
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "About the simplest modal you could conceive of :smile:\n\nMaybe <https://api.slack.com/reference/block-kit/interactive-components|*make the modal interactive*> or <https://api.slack.com/surfaces/modals/using#modifying|*learn more advanced modal use cases*>.",
              },
            },
            {
              type: "context",
              elements: [
                {
                  type: "mrkdwn",
                  text: "Psssst this modal was designed using <https://api.slack.com/tools/block-kit-builder|*Block Kit Builder*>",
                },
              ],
            },
          ],
        },
      });
    } catch (error) {
      console.error(error);
    }
  });
}
