import * as SlackBolt from "@slack/bolt";

import { db } from "~db";

export function setupSlackCommands(slackApp: SlackBolt.App) {
  slackApp.command("/acapela", async ({ command, ack, respond }) => {
    // Acknowledge command request
    await ack();
    const roomNameInput = command.text || "Slack Conversation";
    const teamSlackInstallation = await db.team_slack_installation.findFirst({
      where: { slack_team_id: command.team_id },
      include: { team: true },
    });
    const team = teamSlackInstallation?.team;
    if (!team) {
      return await respond("No team found");
    }
    const space = await db.space.findFirst({ where: { team_id: team.id } });
    if (!space) {
      return await respond("No space found");
    }
    const room = await db.room.create({
      data: {
        name: roomNameInput,
        slug: roomNameInput,
        creator_id: team.owner_id,
        owner_id: team.owner_id,
        space_id: space.id,
      },
    });
    if (!room) {
      return await respond("Room creation failed");
    }
    await respond(`You can find the Acapela room here: ${process.env.FRONTEND_URL}/space/${space.id}/${room.id}`);
  });
}
