import * as SlackBolt from "@slack/bolt";
import { ConversationsMembersResponse } from "@slack/web-api";

import { db } from "~db";
import { isNotNullish } from "~shared/nullish";

import { getSlackInstallURL } from "./install";

export function setupSlackCommands(slackApp: SlackBolt.App) {
  slackApp.command("/acapela", async ({ command, ack, respond, client, context }) => {
    // Acknowledge command request
    await ack();
    let roomNameInput = command.text;
    if (!roomNameInput) {
      respond(
        `You can set a room name by writing it after the /acapela command (eg "/acapela Quick tech discussion") `
      );
      roomNameInput = `Slack Conversation with ${command.user_name}`;
    }
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
    let conversationMemberResponse: ConversationsMembersResponse | undefined = undefined;
    try {
      conversationMemberResponse = await client.conversations.members({
        channel: command.channel_id,
        token: context.userToken,
      });
      if (!conversationMemberResponse || !conversationMemberResponse.members) {
        return await respond("No members found");
      }
    } catch (error) {
      return await respond(
        `/acapela command needs Slack integration in order to work in private conversations. ` +
          `Please connect Acapela with your Slack here ${await getSlackInstallURL({
            withBot: false,
          })} before using the command again`
      );
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
      text: `Please continue the discussion here: ${process.env.FRONTEND_URL}/space/${space.id}/${room.id}`,
    });
  });
}
