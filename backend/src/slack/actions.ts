import { App } from "@slack/bolt";

import { SlackActionIds } from "./blocks";

export function setupSlackActionHandlers(slackApp: App) {
  slackApp.action(SlackActionIds.ReOpenTopic, async (options) => {
    console.log("CLOSE");

    await options.ack();
  });

  slackApp.action(SlackActionIds.ArchiveTopic, async (options) => {
    console.log("Archive");

    await options.ack();
  });
}
