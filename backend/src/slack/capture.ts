import { Prisma } from "@prisma/client";
import { AllMiddlewareArgs, GenericMessageEvent, App as SlackApp, SlackEventMiddlewareArgs } from "@slack/bolt";
import { WebClient } from "@slack/web-api";
import { Channel } from "@slack/web-api/dist/response/ChannelsInfoResponse";
import { Team } from "@slack/web-api/dist/response/TeamInfoResponse";
import nr from "newrelic";
import { SingleASTNode } from "simple-markdown";

import { redisClient } from "@aca/backend/src/redis";
import { slackClient } from "@aca/backend/src/slack/app";
import {
  convertMessageContentToPlainText,
  parseAndTransformToTipTapJSON,
  parseSlackMarkdown,
} from "@aca/backend/src/slack/md/parser";
import { SlackTeam, User, UserSlackInstallation, db } from "@aca/db";
import { assert } from "@aca/shared/assert";
import { logger } from "@aca/shared/logger";
import { isNotNullish } from "@aca/shared/nullish";

import { getSlackInstallationData } from "./utils";

async function getSlackUserName(token?: string, teamId?: string, userId?: string): Promise<string> {
  if (!token || !userId || !teamId) return "Unknown";

  const userNameKey = `slack:username:${teamId}:${userId}`;
  const cachedUsername = await redisClient.get(userNameKey);
  if (cachedUsername) return cachedUsername;

  const { user } = await slackClient.users.info({ token: token, user: userId });
  // For Slack-Connect users the name was only found within the profile object
  const username = user?.profile?.real_name ?? user?.real_name ?? "Unknown";
  await redisClient.set(userNameKey, username, "EX", 60 * 60); // cache username for one hour
  return username;
}

export function findUserForSlackInstallation(slackUserId: string) {
  try {
    return db.user.findFirst({
      where: { user_slack_installation: { some: { slack_user_id: slackUserId } } },
    });
  } catch (error) {
    logger.warn(error, `Error while querying for slack user ${slackUserId}`);
    return null;
  }
}

function extractMentionedSlackUserIds(nodes: SingleASTNode[]): [string[], boolean] {
  let isChannelMention = false;

  return [
    nodes.flatMap((node) => {
      if (Array.isArray(node.content)) {
        const [userIds, isChildChannelMention] = extractMentionedSlackUserIds(node.content);
        if (isChildChannelMention) {
          isChannelMention = true;
        }
        return userIds;
      } else {
        if (node.type === "slackAtHere" || node.type === "slackAtChannel") {
          isChannelMention = true;
          return [];
        }

        return node.type == "slackUser" ? [node.id] : [];
      }
    }),
    isChannelMention,
  ];
}

const extractMentionedSlackUserIdsFromMd = (text?: string) =>
  extractMentionedSlackUserIds(parseSlackMarkdown(text ?? ""));

async function resolveMessageNotifications(userId: string, whereMessage: Prisma.notification_slack_messageWhereInput) {
  await db.notification.updateMany({
    where: {
      resolved_at: null,
      user_id: userId,
      notification_slack_message: whereMessage,
    },
    data: { resolved_at: new Date().toISOString() },
  });
}

// A special client authorized with the app token for the few API calls that need app level scopes
const appClient = new WebClient(process.env.SLACK_APP_TOKEN);
async function findUserSlackInstallations(eventContextId: string) {
  const { authorizations } = await appClient.apps.event.authorizations.list({ event_context: eventContextId });
  return db.user_slack_installation.findMany({
    where: {
      OR: (authorizations ?? [])
        .filter((auth) => auth.team_id && auth.user_id)
        .map((auth) => ({ slack_team_id: auth.team_id, slack_user_id: auth.user_id })),
    },
    include: { user: true, slack_team: true },
  });
}

const createTextPreviewFromSlackMessage = async (
  userToken: string,
  slackMessageText: string,
  teamId: string,
  mentionedSlackUserIds: string[]
) => {
  const mentionedNamesBySlackId = Object.fromEntries(
    await Promise.all(
      mentionedSlackUserIds.map(async (slackUserId) => [
        slackUserId,
        await getSlackUserName(userToken, teamId, slackUserId),
      ])
    )
  );
  return convertMessageContentToPlainText(parseAndTransformToTipTapJSON(slackMessageText, { mentionedNamesBySlackId }));
};

async function recordInvolvedThreadUsers(message: GenericMessageEvent) {
  const [mentionedUserIds] = extractMentionedSlackUserIdsFromMd(message.text);
  const userIds = mentionedUserIds.concat(message.user).filter(isNotNullish);
  if (userIds.length > 0) {
    await db.slack_thread_involed_user.createMany({
      data: userIds.map((userId) => ({ user_id: userId, thread_ts: message.thread_ts ?? message.ts })),
      skipDuplicates: true,
    });
  }
}

// A user is involved in a thread if they have posted in it or were mentioned in it
async function checkIsInvolvedInThread(
  token: string,
  channel: string,
  ts: string,
  slackUserId: string
): Promise<boolean> {
  return Boolean(await db.slack_thread_involed_user.findFirst({ where: { user_id: slackUserId, thread_ts: ts } }));
}

const jsonIncludesChannel = (jsonB: Prisma.JsonValue, channel: string) =>
  Array.isArray(jsonB) && jsonB.includes(channel);

type TeamFilterMessage = Pick<GenericMessageEvent, "bot_id" | "team" | "channel">;

async function isMessageAllowedByTeamFilters(user: User, message: TeamFilterMessage) {
  const channelsByTeam = await db.user_slack_channels_by_team.findMany({
    where: {
      user_id: user.id,
    },
  });

  const isMessageFromBot = !!message.bot_id;

  // This is the efficient way of managing it, but team has to be part of the message event
  if (message.team) {
    const teamChannelsHolder = channelsByTeam.find((cbt) => cbt.slack_workspace_id === message.team);
    if (!teamChannelsHolder) {
      return false;
    }
    const { included_channels, excluded_channels, are_all_channels_included, are_bots_enabled } = teamChannelsHolder;
    if (isMessageFromBot && !are_bots_enabled) {
      return false;
    }

    return (
      (!are_all_channels_included && jsonIncludesChannel(included_channels, message.channel)) ||
      (are_all_channels_included && !jsonIncludesChannel(excluded_channels, message.channel))
    );
  }

  // In some cases we may not get the team from the slack event, this is the other least efficient way of finding things
  return channelsByTeam.some(({ included_channels, are_bots_enabled }) => {
    return jsonIncludesChannel(included_channels, message.channel) && (isMessageFromBot ? are_bots_enabled : true);
  });
}

/**
 * Creates notification for the given user who are in the Slack conversation in which the message was posted. If the
 * conversation is a Slack channel we only create a notification if it was a mention or within a thread.
 */
async function createNotificationFromMessage(
  userSlackInstallation: UserSlackInstallation & { user: User; slack_team: SlackTeam },
  message: Pick<GenericMessageEvent, "channel" | "thread_ts" | "ts" | "text" | "user" | "channel_type"> &
    TeamFilterMessage,
  authorUserName: string,
  slackChannel?: Channel
) {
  const installationData = getSlackInstallationData(userSlackInstallation);
  const { id: slackUserId, token: userToken } = installationData.user;
  const { channel, ts: messageTs, thread_ts: threadTs, user: authorSlackUserId } = message;

  const [mentionedSlackUserIds, isChannelMention] = extractMentionedSlackUserIdsFromMd(message.text);
  const isUserMentioned = mentionedSlackUserIds.includes(slackUserId);
  const isMentioned = isChannelMention || isUserMentioned;

  const is_IM_or_MPIM = message.channel_type == "im" || message.channel_type == "mpim";
  const isAuthor = authorSlackUserId === slackUserId;

  if (
    !userToken ||
    (isAuthor && !isUserMentioned) ||
    (threadTs && !(await checkIsInvolvedInThread(userToken, channel, threadTs, slackUserId))) ||
    (!is_IM_or_MPIM && !isMentioned && !(await isMessageAllowedByTeamFilters(userSlackInstallation.user, message)))
  ) {
    return;
  }

  const teamInfo = userSlackInstallation.slack_team.team_info_data as Team;
  assert(teamInfo.url, `could not get team url for ${userSlackInstallation.slack_team.slack_team_id}`);

  let permalink = `${teamInfo.url}archives/${message.channel}/p${messageTs.replace(".", "")}`;
  if (message.thread_ts) permalink += `?thread_ts=${message.thread_ts}&cid=${message.channel}`;

  await db.notification.create({
    data: {
      user_id: userSlackInstallation.user_id,
      from: authorUserName,
      url: permalink,
      text_preview: await nr.startSegment(
        "slack/createNotificationFromMessage/createTextPreviewFromSlackMessage",
        true,
        async () =>
          createTextPreviewFromSlackMessage(
            userToken,
            message.text ?? "",
            userSlackInstallation.slack_team_id,
            mentionedSlackUserIds
          )
      ),
      created_at: new Date(Number(message.ts) * 1000).toISOString(),
      notification_slack_message: {
        create: {
          user_slack_installation_id: userSlackInstallation.id,
          slack_user_id: message.user,
          slack_conversation_id: message.channel,
          slack_thread_ts: threadTs,
          slack_message_ts: messageTs,
          is_mention: isMentioned,
          conversation_type: message.channel_type,
          conversation_name: slackChannel
            ? (slackChannel.is_private ? "🔒 " : "#") + slackChannel.name_normalized
            : message.channel_type == "im"
            ? "Direct Message"
            : "Group Chat",
        },
      },
    },
  });
}

export async function captureInitialMessages(userSlackInstallation: UserSlackInstallation) {
  try {
    const userId = userSlackInstallation.user_id;
    const [user, slackTeam] = await Promise.all([
      db.user.findUnique({ where: { id: userId } }),
      db.slack_team.findUnique({ where: { slack_team_id: userSlackInstallation.slack_team_id } }),
    ]);
    assert(user, "missing user for id " + userId);
    assert(slackTeam, "missing slack team for id " + userId);

    const { token } = getSlackInstallationData(userSlackInstallation).user;
    // Caution: When we change the types here, channel_type further below needs to also be updated
    const { channels } = await slackClient.conversations.list({ token, types: "im,mpim", exclude_archived: true });
    for (const conversation of channels ?? []) {
      const { channel } = await slackClient.conversations.info({ token, channel: conversation.id! });
      if (!channel) {
        continue;
      }
      const { messages } = await slackClient.conversations.history({
        token,
        channel: conversation.id!,
        oldest: Number(channel.last_read) == 0 ? undefined : channel.last_read,
        limit: 10,
      });
      if (!messages) {
        continue;
      }
      for (const message of messages) {
        await createNotificationFromMessage(
          { ...userSlackInstallation, user, slack_team: slackTeam },
          {
            text: message.text,
            channel: conversation.id!,

            channel_type: conversation.is_im ? "im" : "mpim",
            user: message.user!,
            ts: message.ts!,
            ...message,
          },
          await getSlackUserName(token, userSlackInstallation.slack_team_id, message.user)
        );
      }
    }
  } catch (error) {
    logger.error(
      error,
      `Error while capturing initial messages for user_slack_installation ${userSlackInstallation.id}`
    );
  }
}

async function handleMessages({ message, body, client }: SlackEventMiddlewareArgs<"message"> & AllMiddlewareArgs) {
  const eventContextId = body.event_context as string;
  message = message as GenericMessageEvent;

  if (message.type !== "message" || message.text === undefined) {
    return;
  }

  // somehow passing message directly inside the anonymous segment functions causes a type error
  // ¯\_(ツ)_/¯
  const msg = message;

  const author = await nr.startSegment("slack/message/findUserForSlackInstallation", true, async () =>
    findUserForSlackInstallation(msg.user)
  );
  if (author?.is_slack_auto_resolve_enabled) {
    try {
      const threadTs = message.thread_ts;
      await nr.startSegment("slack/message/resolveMessageNotifications", true, async () =>
        resolveMessageNotifications(author.id, {
          slack_conversation_id: msg.channel,
          OR: [
            threadTs
              ? { OR: [{ slack_thread_ts: threadTs }, { slack_message_ts: threadTs }] }
              : { slack_thread_ts: null },
          ],
        })
      );
    } catch (error) {
      logger.error(error, "Error resolving slack notifications");
    }
  }

  try {
    await nr.startSegment("slack/message/recordInvolvedThreadUsers", true, async () => recordInvolvedThreadUsers(msg));
  } catch (error) {
    logger.error(error, `Error recording involved thread users for message: ${JSON.stringify(message)}`);
  }

  const userSlackInstallations = await findUserSlackInstallations(eventContextId);

  const isPublicChannel = message.channel_type !== "im" && message.channel_type !== "mpim";
  const channelInfo = isPublicChannel
    ? (await client.conversations.info({ channel: message.channel })).channel
    : undefined;

  const channelMembers = isPublicChannel
    ? (await client.conversations.members({ channel: message.channel })).members
    : undefined;

  const authorUserName = await getSlackUserName(client.token, body.team_id, message.user);

  for (const userSlackInstallation of userSlackInstallations) {
    if (channelMembers && !channelMembers.includes(userSlackInstallation.slack_user_id)) {
      // user is not a member of the channel
      continue;
    }
    try {
      await nr.startSegment("slack/message/createNotificationFromMessage", true, async () =>
        createNotificationFromMessage(userSlackInstallation, msg, authorUserName, channelInfo)
      );
    } catch (error) {
      logger.error(error, "Error creating slack notifications");
    }
  }
}

async function handleReactionAdded({ event }: SlackEventMiddlewareArgs<"reaction_added"> & AllMiddlewareArgs) {
  if (!event.user) {
    return;
  }
  const user = await findUserForSlackInstallation(event.user);
  if (user?.is_slack_auto_resolve_enabled && event.item.type === "message") {
    const { channel, ts } = event.item;
    await resolveMessageNotifications(user.id, { slack_conversation_id: channel, slack_message_ts: ts });
  }
}

export function setupSlackCapture(app: SlackApp) {
  app.event("message", async function (event) {
    nr.incrementMetric("slack/message/count");
    await nr.startBackgroundTransaction("slack_event_message", async () => handleMessages(event));
  });

  app.event("reaction_added", async function (event) {
    nr.incrementMetric("slack/reaction_added/count");
    await nr.startBackgroundTransaction("slack_event_reaction_added", async () => handleReactionAdded(event));
  });
}
