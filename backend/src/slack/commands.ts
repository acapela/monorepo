import * as SlackBolt from "@slack/bolt";
// import { db } from "~db";

export function setupSlackCommands(slackApp: SlackBolt.App) {
  slackApp.command("/acapela", async ({ command, ack, respond }) => {
    // Acknowledge command request
    await ack();
    console.info("/acapela command called");
    await respond(`${command.text}`);
  });
}
