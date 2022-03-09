import { orderBy } from "lodash";

import { getIndividualSlackInstallURL } from "@aca/backend/src/slack/install";
import { db } from "@aca/db";
import { GetSlackInstallationUrlInput, GetSlackInstallationUrlOutput, ServiceUser, SlackConversation } from "@aca/gql";
import { assert, assertDefined } from "@aca/shared/assert";

import { ActionHandler } from "../actions/actionHandlers";
import { SlackInstallation, slackClient } from "./app";

async function findSlackTeamsWithTokens(userId: string) {
  const userSlackInstallations = await db.user_slack_installation.findMany({ where: { user_id: userId } });
  return userSlackInstallations.map(({ data }) => {
    const installData = data as unknown as SlackInstallation;
    return { id: installData.team!.id, token: installData.user.token };
  });
}

export const getIndividualSlackInstallationURLHandler: ActionHandler<
  { input: GetSlackInstallationUrlInput },
  GetSlackInstallationUrlOutput
> = {
  actionName: "get_slack_installation_url",

  async handle(userId, { input: { teamId, redirectURL } }) {
    assert(userId, "must have userId");
    return { url: await getIndividualSlackInstallURL({ userId, teamId, redirectURL }) };
  },
};

export const slackUsers: ActionHandler<void, ServiceUser[]> = {
  actionName: "slack_users",

  async handle(userId) {
    const teams = await findSlackTeamsWithTokens(assertDefined(userId, "missing userId"));
    const teamUserPromises = teams.map(async (team) => {
      const { members } = await slackClient.users.list({ token: team.token });
      return (members ?? []).map(
        (member) =>
          ({
            workspace_id: team.id,
            id: assertDefined(member.id, `missing id for member ${JSON.stringify(member)}`),
            display_name: assertDefined(member.name, `missing name for member ${JSON.stringify(member)}`),
            real_name: member.real_name ?? null,
            avatar_url: member.profile?.image_original ?? null,
          } as ServiceUser)
      );
    });
    return orderBy((await Promise.all(teamUserPromises)).flat(), (u) => u.real_name ?? u.display_name);
  },
};

export const slackConversations: ActionHandler<void, SlackConversation[]> = {
  actionName: "slack_conversations",

  async handle(userId) {
    const teams = await findSlackTeamsWithTokens(assertDefined(userId, "missing userId"));
    const teamUserPromises = teams.map(async (team) => {
      const { channels } = await slackClient.conversations.list({
        token: team.token,
        types: "private_channel,public_channel",
        limit: 200,
      });
      return (channels ?? []).map(
        (channel) =>
          ({
            workspace_id: team.id,
            id: assertDefined(channel.id, `missing id for channel ${JSON.stringify(channel)}`),
            name: assertDefined(channel.name, `missing name for channel ${JSON.stringify(channel)}`),
            is_private: !!channel.is_private,
          } as SlackConversation)
      );
    });
    return orderBy((await Promise.all(teamUserPromises)).flat(), "name");
  },
};
