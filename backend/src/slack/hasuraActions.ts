import * as Sentry from "@sentry/node";

import { db } from "@aca/db";
import {
  GetTeamSlackInstallationUrlInput,
  GetTeamSlackInstallationUrlOutput,
  ServiceUser,
  SlackConversation,
  SlackUserOutput,
  UninstallSlackOutput,
} from "@aca/gql";
import { assert, assertDefined } from "@aca/shared/assert";
import { Maybe } from "@aca/shared/types";

import { ActionHandler } from "../actions/actionHandlers";
import { UnprocessableEntityError } from "../errors/errorTypes";
import { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, SlackInstallation, slackClient } from "./app";
import { getTeamSlackInstallURL, getUserSlackInstallURL } from "./install";
import { checkHasSlackInstallationAllBotScopes, fetchTeamBotToken, findSlackUserId } from "./utils";

export const getTeamSlackInstallationURLHandler: ActionHandler<
  { input: GetTeamSlackInstallationUrlInput },
  GetTeamSlackInstallationUrlOutput
> = {
  actionName: "get_team_slack_installation_url",

  async handle(userId, { input: { team_id, redirectURL } }) {
    assert(userId, "userId is required");
    const team = await db.team.findFirst({
      where: {
        id: team_id,
        OR: [
          // During the initial setup flow the owner might not have been added as a team_member yet
          { owner_id: userId },
          { team_member: { some: { user_id: userId } } },
        ],
      },
      include: { team_member: true, team_slack_installation: true },
    });
    assert(team, new UnprocessableEntityError(`Team ${team_id} for member ${userId} not found`));

    const getSlackInstallURL = checkHasSlackInstallationAllBotScopes(team.team_slack_installation?.data)
      ? getUserSlackInstallURL
      : getTeamSlackInstallURL;
    return { url: await getSlackInstallURL({ teamId: team_id, redirectURL, userId }) };
  },
};

async function assertFindSlackToken(userId: string) {
  const userSlackInstallation = await db.user_slack_installation.findFirst({ where: { user_id: userId } });
  assert(userSlackInstallation, `no slack installation for user ${userId}`);
  return (userSlackInstallation?.data as unknown as SlackInstallation).user.token;
}

export const slackUsers: ActionHandler<void, ServiceUser[]> = {
  actionName: "slack_users",

  async handle(userId) {
    assert(userId, "missing userId");
    const { members, error } = await slackClient.users.list({ token: await assertFindSlackToken(userId) });

    if (error) {
      Sentry.captureException(error);
      throw new Error("Error while fetching slack users");
    }

    return (members ?? []).map((member) => ({
      id: assertDefined(member.id, `missing id for member ${JSON.stringify(member)}`),
      display_name: assertDefined(member.name, `missing name for member ${JSON.stringify(member)}`),
      real_name: member.real_name ?? null,
      avatar_url: member.profile?.image_original ?? null,
    })) as ServiceUser[];
  },
};

export const slackConversations: ActionHandler<void, SlackConversation[]> = {
  actionName: "slack_conversations",

  async handle(userId) {
    assert(userId, "missing userId");

    const { channels, error } = await slackClient.conversations.list({
      token: await assertFindSlackToken(userId),
      types: "private_channel,public_channel",
      limit: 200,
    });

    if (error) {
      Sentry.captureException(error);
      throw new Error("Error while fetching slack conversations");
    }

    return (channels ?? []).map((channel) => ({
      id: assertDefined(channel.id, `missing id for channel ${JSON.stringify(channel)}`),
      name: assertDefined(channel.name, `missing name for channel ${JSON.stringify(channel)}`),
      is_private: !!channel.is_private,
    })) as SlackConversation[];
  },
};

export const slackUser: ActionHandler<{ team_id: string }, SlackUserOutput> = {
  actionName: "slack_user",

  async handle(userId, { team_id }) {
    let slackUserId: Maybe<string>;
    if (userId) {
      const user = await db.user.findUnique({ where: { id: userId } });
      if (user) {
        slackUserId = await findSlackUserId(team_id, user);
      }
    }

    return { slack_user_id: slackUserId };
  },
};

export const uninstallSlack: ActionHandler<{ team_id: string }, UninstallSlackOutput> = {
  actionName: "uninstall_slack",

  async handle(userId, { team_id }) {
    const [team, botToken] = await Promise.all([
      db.team.findUnique({ where: { id: team_id } }),
      fetchTeamBotToken(team_id),
    ]);
    if (!team || team.owner_id !== userId) {
      return { success: false };
    }
    const response = await slackClient.apps.uninstall({
      token: botToken,
      client_id: SLACK_CLIENT_ID,
      client_secret: SLACK_CLIENT_SECRET,
    });

    if (!response.ok || response.error) {
      Sentry.captureException(new Error(`Slack uninstall failed: ${response.error ?? "without error information"}`));
      return { success: false };
    }
    return { success: true };
  },
};
