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
  UpdateSlackMessagesReadStatusOutput,
} from "@aca/gql";
import { assert, assertDefined } from "@aca/shared/assert";

import { ActionHandler } from "../actions/actionHandlers";
import { revertGmailMessageToUnread } from "../gmail/revertRead";
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
        revertGmailMessageToUnread(inner_notification_id, userId);
    }
    return { success: true };
  },
};

export const updateSlackMessagesReadStatus: ActionHandler<void, UpdateSlackMessagesReadStatusOutput> = {
  actionName: "update_slack_messages_read_status",

  async handle(userId) {
    // Get all installations for user
    const userSlackInstallations = await db.user_slack_installation.findMany({
      where: {
        user_id: userId,
      },
    });

    for (const installation of userSlackInstallations) {
      const installData = installation.data as unknown as SlackInstallation;
      const token = installData.user.token;

      if (!token) {
        continue;
      }

      // Get all conversations of user
      let conversations;
      try {
        conversations = await slackClient.users.conversations({
          token: token,
          types: "public_channel,private_channel,mpim,im",
          user: installData.user.id,
          exclude_archived: true,
        });
      } catch (error) {
        continue;
      }

      if (!conversations.channels) {
        // Empty conversations list
        return { success: true };
      }

      for (const channel of conversations.channels) {
        if (!channel.id) {
          // Don't know why this would happen, but safeguard against it anyway
          continue;
        }
        const info = await slackClient.conversations.info({
          token: token,
          channel: channel.id,
        });

        // Current read timestamp of the user for this channel
        const timestamp = info.channel?.last_read;

        // Get all messages that are older than the current read timestamp and not yet marked as read
        const newlyReadMessages = await db.notification_slack_message.findMany({
          where: {
            slack_conversation_id: info.channel?.id,
            user_slack_installation_id: installation.id,
            is_read: false,
            slack_message_ts: { lte: timestamp },
          },
        });

        // Mark messages as read
        await Promise.all(
          newlyReadMessages.map(async (message) => {
            await db.notification_slack_message.update({
              where: { id: message.id },
              data: {
                is_read: true,
              },
            });
          })
        );
      }
    }
    return { success: true };
  },
};
