import * as SlackBolt from "@slack/bolt";

import { db } from "~db";
import { assert } from "~shared/assert";
import { isNotNullish } from "~shared/nullish";

import { isChannelNotFoundError } from ".//utils";
import { getSlackInstallURL } from "./install";

export function setupSlackCommands(slackApp: SlackBolt.App) {
  slackApp.command("/acapela", async ({ command, ack, respond, client, context }) => {
    await ack();

    let roomNameInput = command.text;
    if (!roomNameInput) {
      await respond(
        `You can set a room name by writing it after the /acapela command (eg "/acapela Quick tech discussion") `
      );
      roomNameInput = `Slack Conversation with ${command.user_name}`;
    }

    const team = await db.team.findFirst({
      where: { team_slack_installation: { slack_team_id: command.team_id } },
    });
    assert(team, "should always find a team");

    const [space, email] = await Promise.all([
      db.space.findFirst({ where: { team_id: team.id } }),
      command.user_id
        ? client.users.profile.get({ user: command.user_id }).then(({ profile }) => profile?.email)
        : null,
    ]);
    if (!space) {
      return respond(
        "Your team does not have a space for Acapela rooms. Create one over at https://app.acape.la/spaces and try again."
      );
    }

    const user = email ? await db.user.findFirst({ where: { email } }) : null;

    const getMembers = async (token?: string) =>
      (
        await client.conversations.members({
          channel: command.channel_id,
          token,
        })
      )?.members ?? [];

    let slackMembers: string[] | null = null;
    try {
      slackMembers = await getMembers(context.userToken ?? context.botToken);
    } catch (error) {
      if (!isChannelNotFoundError(error)) {
        throw error;
      }

      if (!user) {
        return respond(
          `There is no Acapela account for your email address (${email}). Ask your team's owner to invite you and run this command again.`
        );
      }
      const slackInstallURL = await getSlackInstallURL({ withBot: false }, { teamId: team.id, userId: user.id });
      return respond({
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:
                `Slack integration is required to open an Acapela from private conversations. ` +
                `Please run the command again after connecting Acapela with your Slack <${slackInstallURL}|here>`,
            },
          },
        ],
      });
    }

    const slackProfileResponses = await Promise.all(
      slackMembers?.map((memberId) => client.users.profile.get({ user: memberId })) ?? []
    );
    const emails = slackProfileResponses.map((response) => response.profile?.email).filter(isNotNullish);
    const users = await db.user.findMany({ where: { email: { in: emails } } });

    const creatorId = user ? user.id : team.owner_id;
    const room = await db.room.create({
      data: {
        name: roomNameInput,
        slug: roomNameInput,
        creator_id: creatorId,
        owner_id: creatorId,
        space_id: space.id,
        room_member: { createMany: { data: users.map((u) => ({ user_id: u.id })) } },
      },
    });
    if (!room) {
      return respond("Room creation failed");
    }

    if (slackMembers && users.length < slackMembers.length) {
      await respond(
        "We could not find all conversation members in Acapela, they can still join the conversation through the link"
      );
    }
    await respond({
      response_type: "in_channel",
      text: `Please continue the discussion here: ${process.env.FRONTEND_URL}/space/${space.id}/${room.id}`,
    });
  });
}
