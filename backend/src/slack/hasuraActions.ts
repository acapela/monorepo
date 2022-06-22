import { Channel } from "@slack/web-api/dist/response/ChannelsListResponse";
import { orderBy } from "lodash";

import { getIndividualSlackInstallURL } from "@aca/backend/src/slack/install";
import { db } from "@aca/db";
import {
  ConversationInfo,
  GetSlackInstallationUrlInput,
  GetSlackInstallationUrlOutput,
  HandleRevertUrlViewInput,
  HandleRevertUrlViewOutput,
  ServiceUser,
  SlackConversation,
  UpdateSlackMessagesReadStatusOutput,
} from "@aca/gql";
import { assert, assertDefined } from "@aca/shared/assert";
import { logger } from "@aca/shared/logger";
import { MINUTE } from "@aca/shared/time";

import { ActionHandler } from "../actions/actionHandlers";
import { revertGmailMessageToUnread } from "../gmail/revertRead";
import { redisCached } from "../redis";
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

async function getUserConversationIdMap(token?: string) {
  const { channels = [] } = await slackClient.users.conversations({ token, types: "im" });

  const map = new Map<string, string>();

  for (const channel of channels) {
    if (channel.user && channel.id) {
      map.set(channel.user, channel.id);
    }
  }

  return map;
}

const getSlackUsersForUser = redisCached("getSlackUsersForUser_v2", MINUTE, async (userId: string) => {
  const teams = await findSlackTeamsWithTokens(assertDefined(userId, "missing userId"));
  const teamUserPromises = teams.map(async (team) => {
    const [{ members }, userConversationIdLookup] = await Promise.all([
      slackClient.users.list({ token: team.token }),
      getUserConversationIdMap(team.token),
    ]);

    return (members ?? []).map(
      (member) =>
        ({
          workspace_id: team.id,
          id: assertDefined(member.id, `missing id for member ${JSON.stringify(member)}`),
          display_name: assertDefined(member.name, `missing name for member ${JSON.stringify(member)}`),
          real_name: member.real_name ?? null,
          avatar_url: member.profile?.image_original ?? null,
          conversation_id: userConversationIdLookup.get(member.id!) ?? null,
          is_bot: member.is_bot ?? false,
        } as ServiceUser)
    );
  });
  return orderBy((await Promise.all(teamUserPromises)).flat(), (u) => u.real_name ?? u.display_name);
});

export const slackUsers: ActionHandler<void, ServiceUser[]> = {
  actionName: "slack_users",

  async handle(userId) {
    return getSlackUsersForUser(assertDefined(userId, "missing userId"));
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

export const updateSlackMessagesReadStatus: ActionHandler<
  { input: ConversationInfo[] },
  UpdateSlackMessagesReadStatusOutput
> = {
  actionName: "update_slack_messages_read_status",

  async handle(userId, { input: conversations }) {
    // Cache slack installations and conversations so we don't compute anything multiple times
    const slackInstallationMap = new Map<
      string,
      { installation: SlackInstallation; conversations: Map<string, boolean> }
    >();

    for (const conversation of conversations) {
      let slackInstallationData = slackInstallationMap.get(conversation.slackInstallation);

      // Installation not in map yet, fetch it
      if (!slackInstallationData) {
        const installationRawData = await db.user_slack_installation.findUnique({
          where: {
            id: conversation.slackInstallation,
          },
        });

        if (!installationRawData) {
          logger.error("Tried to mark Slack message as read for missing Slack installation");
          continue;
        }

        const slackInstallation = installationRawData?.data as unknown as SlackInstallation;

        slackInstallationData = { installation: slackInstallation, conversations: new Map<string, boolean>() };
        slackInstallationMap.set(conversation.slackInstallation, slackInstallationData);
      }

      if (slackInstallationData.conversations.has(conversation.conversationId)) {
        // Conversation has already been processed
        continue;
      }

      slackInstallationData.conversations.set(conversation.conversationId, true);

      const token = slackInstallationData.installation.user.token;

      if (!token) {
        logger.error(`Missing user token for slack installation ${conversation.slackInstallation}`);
        continue;
      }

      const conversationInfo = await slackClient.conversations.info({
        token: token,
        channel: conversation.conversationId,
      });

      if (!conversationInfo.channel) {
        continue;
      }

      const channel = conversationInfo.channel;

      if (!channel.id) {
        // Don't know why this would happen, but safeguard against it anyway
        continue;
      }

      // Current read timestamp of the user for this channel
      const timestamp = channel.last_read;

      // Get all messages that are older than the current read timestamp and not yet marked as read
      const newlyReadMessages = await db.notification_slack_message.findMany({
        where: {
          slack_conversation_id: channel.id,
          user_slack_installation_id: conversation.slackInstallation,
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

    return { success: true };
  },
};
