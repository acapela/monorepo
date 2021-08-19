import * as SlackBolt from "@slack/bolt";

import { db } from "~db";
import { isNotNullish } from "~shared/nullish";

export function setupSlackCommands(slackApp: SlackBolt.App) {
  slackApp.command("/acapela", async ({ command, ack, respond, client }) => {
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
    console.info(command.channel_id);
    const conversationMemberResponse = await client.conversations.members({
      channel: command.channel_id,
    });
    if (!conversationMemberResponse.members) {
      return await respond("No conversation members found");
    }
    const memberQueries = conversationMemberResponse.members.map((memberId) =>
      client.users.profile.get({ user: memberId })
    );
    const memberProfiles = await Promise.all(memberQueries);
    const users = await db.user.findMany({
      where: {
        email: { in: memberProfiles.map((response) => response.profile?.email).filter(isNotNullish) },
      },
    });
    const room = await db.room.create({
      data: {
        name: roomNameInput,
        slug: roomNameInput,
        creator_id: team.owner_id,
        owner_id: team.owner_id,
        space_id: space.id,
        room_member: { createMany: { data: users.map((u) => ({ user_id: u.id })) } },
      },
    });
    if (!room) {
      return await respond("Room creation failed");
    }
    await respond({
      response_type: "in_channel",
      text: `You can find the Acapela room here: ${process.env.FRONTEND_URL}/space/${space.id}/${room.id}`,
    });
  });
}
