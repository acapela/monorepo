import { Channel } from "@slack/web-api/dist/response/ChannelsListResponse";
import { orderBy } from "lodash";

import { getIndividualSlackInstallURL } from "@aca/backend/src/slack/install";
import { db } from "@aca/db";
import {
  GetSlackInstallationUrlInput,
  GetSlackInstallationUrlOutput,
  HandleRevertUrlViewInput,
  HandleRevertUrlViewOutput,
  ServiceUser,
  SlackConversation,
} from "@aca/gql";
import { assert, assertDefined } from "@aca/shared/assert";

import { ActionHandler } from "../actions/actionHandlers";
import { revertGmailRead } from "../gmail/revertRead";
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

async function fetchRemainingChannels(
  token: string,
  accumulatedChannels: Channel[] = [],
  next_cursor: string | undefined
): Promise<Channel[]> {
  if (!next_cursor) {
    return accumulatedChannels;
  }

  const { channels, response_metadata } = await slackClient.conversations.list({
    token: token,
    exclude_archived: true,
    types: "private_channel,public_channel",
    limit: 200,
    cursor: next_cursor,
  });

  accumulatedChannels.push(...(channels ?? []));

  return fetchRemainingChannels(token, accumulatedChannels, response_metadata?.next_cursor);
}

export const slackConversations: ActionHandler<void, SlackConversation[]> = {
  actionName: "slack_conversations",

  async handle(userId) {
    const teams = await findSlackTeamsWithTokens(assertDefined(userId, "missing userId"));

    const teamUserPromises = teams.map(async (team) => {
      const { channels: initialChannels, response_metadata } = await slackClient.conversations.list({
        token: team.token,
        exclude_archived: true,
        types: "private_channel,public_channel",
        limit: 200,
      });

      const accumulatedChannels = await fetchRemainingChannels(
        team.token as string,
        initialChannels,
        response_metadata?.next_cursor
      );

      const channelsWhereUserIsMember = accumulatedChannels.filter((ch) => ch.is_member);

      return channelsWhereUserIsMember.map(
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

export const handleRevertUrlView: ActionHandler<
  {
    input: HandleRevertUrlViewInput;
  },
  HandleRevertUrlViewOutput
> = {
  actionName: "handle_revert_url_view",

  async handle(userId, { input: { inner_notification_id, inner_table_type } }) {
    switch (inner_table_type) {
      case "notification_gmail":
        revertGmailRead(inner_notification_id, userId);
    }
    return { success: true };
  },
};
