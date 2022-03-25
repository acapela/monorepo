import { Prisma } from "@prisma/client";
import { GenericMessageEvent, App as SlackApp } from "@slack/bolt";
import { WebClient } from "@slack/web-api";
import { SingleASTNode } from "simple-markdown";

import { SlackInstallation, slackClient } from "@aca/backend/src/slack/app";
import {
  convertMessageContentToPlainText,
  parseAndTransformToTipTapJSON,
  parseSlackMarkdown,
} from "@aca/backend/src/slack/md/parser";
import { User, UserSlackInstallation, db } from "@aca/db";
import { assert } from "@aca/shared/assert";
import { trackBackendUserEvent } from "@aca/shared/backendAnalytics";
import { logger } from "@aca/shared/logger";
import {
  USER_ALL_CHANNELS_INCLUDED_PLACEHOLDER,
  USER_SLACK_CONVERSATIONS_MIGRATED_PLACEHOLDER,
} from "@aca/shared/slack";

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

function extractMentionedSlackUserIds(nodes: SingleASTNode[]): string[] {
  return nodes.flatMap((node) => {
    if (Array.isArray(node.content)) {
      return extractMentionedSlackUserIds(node.content);
    } else {
      return node.type == "slackUser" ? [node.id] : [];
    }
  });
}

const extractMentionedSlackUserIdsFromMd = (text?: string) =>
  extractMentionedSlackUserIds(parseSlackMarkdown(text ?? ""));

async function resolveMessageNotifications(userId: string, whereMessage: Prisma.notification_slack_messageWhereInput) {
  const notifications = await db.notification.findMany({
    where: {
      resolved_at: null,
      user_id: userId,
      notification_slack_message: whereMessage,
    },
  });
  await db.notification.updateMany({
    where: { id: { in: notifications.map((n) => n.id) } },
    data: { resolved_at: new Date().toISOString() },
  });
  for (const notification of notifications) {
    trackBackendUserEvent(notification.user_id, "Notification Resolved", {
      notification_id: notification.id,
      auto: true,
    });
  }
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
    include: { user: true },
  });
}

const createTextPreviewFromSlackMessage = async (
  userToken: string,
  slackMessageText: string,
  mentionedSlackUserIds: string[]
) => {
  const mentionedNamesBySlackId = Object.fromEntries(
    await Promise.all(
      mentionedSlackUserIds.map(async (slackUserId) => [
        slackUserId,
        (await slackClient.users.info({ token: userToken, user: slackUserId })).user?.real_name ?? "Unknown",
      ])
    )
  );
  return convertMessageContentToPlainText(parseAndTransformToTipTapJSON(slackMessageText, { mentionedNamesBySlackId }));
};

async function recordInvolvedThreadUsers(message: GenericMessageEvent) {
  const userIds = extractMentionedSlackUserIdsFromMd(message.text).concat(message.user);
  await db.slack_thread_involed_user.createMany({
    data: userIds.map((userId) => ({ user_id: userId, thread_ts: message.thread_ts ?? message.ts })),
    skipDuplicates: true,
  });
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

/*
  ## Migrating from `user.slack_selected_channels` and `user_slack_channels_by_team`

  We're currently migrating data from both places.

  Migration starts right after the SlackSettings component is booted for the first time.
  After we migrate, user.slack_included_channels contents are replaced by `USER_SLACK_CONVERSATIONS_MIGRATED_PLACEHOLDER`
  We use this placeholder here to understand where to look for the corresponding filter.

  Note: I believe that `user.slack_included_channels` should be removed by June 2022.
  If you still find the migration code here and are reading this after the fact... you're it!  
  */
async function isChannelIncludedInChannelFilters(user: User, message: GenericMessageEvent) {
  const deprecatedIncludedChannels = user.slack_included_channels;

  const isMigrationComplete = jsonIncludesChannel(
    deprecatedIncludedChannels,
    USER_SLACK_CONVERSATIONS_MIGRATED_PLACEHOLDER
  );
  if (!isMigrationComplete) {
    return jsonIncludesChannel(deprecatedIncludedChannels, message.channel);
  }

  const channelsByTeam = await db.user_slack_channels_by_team.findMany({
    where: {
      user_id: user.id,
    },
  });

  // This is the efficient way of managing it, but team has to be part of the message event
  if (message.team) {
    const teamChannelsHolder = channelsByTeam.find((cbt) => cbt.slack_workspace_id === message.team);
    if (teamChannelsHolder) {
      const { included_channels } = teamChannelsHolder;
      return (
        jsonIncludesChannel(included_channels, USER_ALL_CHANNELS_INCLUDED_PLACEHOLDER) ||
        jsonIncludesChannel(included_channels, message.channel)
      );
    } else {
      return false;
    }
  }

  // In some cases we may not get the team from the slack event, this is the other least efficient way of finding things
  return channelsByTeam.some((cbt) => jsonIncludesChannel(cbt.included_channels, message.channel));
}

/**
 * Creates notification for the given user who are in the Slack conversation in which the message was posted. If the
 * conversation is a Slack channel we only create a notification if it was a mention or within a thread.
 */
async function createNotificationFromMessage(
  userSlackInstallation: UserSlackInstallation & { user: User },
  message: GenericMessageEvent
) {
  const slackInstallData = userSlackInstallation.data as unknown as SlackInstallation;
  const { id: slackUserId, token: userToken } = slackInstallData.user;
  const { channel, ts: messageTs, thread_ts: threadTs, user: authorSlackUserId } = message;

  const mentionedSlackUserIds = extractMentionedSlackUserIdsFromMd(message.text);
  const isMentioned = mentionedSlackUserIds.includes(slackUserId);

  const is_IM_or_MPIM = message.channel_type == "im" || message.channel_type == "mpim";
  const isAuthor = authorSlackUserId === slackUserId;

  if (
    !userToken ||
    (isAuthor && !isMentioned) ||
    (threadTs && !(await checkIsInvolvedInThread(userToken, channel, threadTs, slackUserId))) ||
    (!is_IM_or_MPIM && !isMentioned && !(await isChannelIncludedInChannelFilters(userSlackInstallation.user, message)))
  ) {
    return;
  }

  const [{ permalink }, { user: authorUser }, { channel: slackChannel }] = await Promise.all([
    slackClient.chat.getPermalink({ token: userToken, channel, message_ts: messageTs }),
    slackClient.users.info({ token: userToken, user: authorSlackUserId }),
    is_IM_or_MPIM
      ? // we only need to fetch info for channels, as we use their name for the notification title
        { channel: undefined }
      : slackClient.conversations.info({ token: userToken, channel }),
  ]);
  assert(permalink, `could not get permalink for message ${messageTs} in channel ${channel}`);
  assert(authorUser, `could not get slack profile for id ${authorSlackUserId}`);

  if (slackChannel && !slackChannel.is_member) {
    return;
  }

  await db.notification.create({
    data: {
      user_id: userSlackInstallation.user_id,
      // For Slack-Connect users the name was only found within the profile object
      from: authorUser.profile?.real_name ?? authorUser.real_name ?? "Unknown",
      url: permalink,
      text_preview: await createTextPreviewFromSlackMessage(userToken, message.text ?? "", mentionedSlackUserIds),
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

export function setupSlackCapture(app: SlackApp) {
  app.event("message", async ({ message, body }) => {
    const eventContextId = body.event_context as string;
    message = message as GenericMessageEvent;

    if (message.type !== "message" || message.text === undefined) {
      return;
    }

    const author = await findUserForSlackInstallation(message.user);
    if (author?.is_slack_auto_resolve_enabled) {
      try {
        const threadTs = message.thread_ts;
        await resolveMessageNotifications(author.id, {
          slack_conversation_id: message.channel,
          OR: [
            threadTs
              ? { OR: [{ slack_thread_ts: threadTs }, { slack_message_ts: threadTs }] }
              : { slack_thread_ts: null },
          ],
        });
      } catch (error) {
        logger.error(error, "Error resolving slack notifications");
      }
    }

    try {
      await recordInvolvedThreadUsers(message);
    } catch (error) {
      logger.error(error, "Error recording involved thread users");
    }

    const userSlackInstallations = await findUserSlackInstallations(eventContextId);
    for (const userSlackInstallation of userSlackInstallations) {
      try {
        await createNotificationFromMessage(userSlackInstallation, message);
      } catch (error) {
        logger.error(error, "Error creating slack notifications");
      }
    }
  });

  app.event("reaction_added", async ({ event }) => {
    if (!event.user) {
      return;
    }
    const user = await findUserForSlackInstallation(event.user);
    if (user?.is_slack_auto_resolve_enabled && event.item.type === "message") {
      const { channel, ts } = event.item;
      await resolveMessageNotifications(user.id, { slack_conversation_id: channel, slack_message_ts: ts });
    }
  });
}
