import { Prisma } from "@prisma/client";
import { GenericMessageEvent, App as SlackApp } from "@slack/bolt";
import { uniq } from "lodash";
import { SingleASTNode } from "simple-markdown";

import { SlackInstallation, slackClient } from "@aca/backend/src/slack/app";
import { isChannelNotFoundError } from "@aca/backend/src/slack/errors";
import { parseSlackMarkdown } from "@aca/backend/src/slack/md/parser";
import { db } from "@aca/db";
import { assert, assertDefined } from "@aca/shared/assert";
import { logger } from "@aca/shared/logger";

export function findUserForSlackInstallation(slackUserId: string) {
  return db.user.findFirst({
    where: { user_slack_installation: { some: { data: { path: ["user", "id"], equals: slackUserId } } } },
  });
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
  await db.notification.updateMany({
    where: {
      resolved_at: null,
      user_id: userId,
      notification_slack_message: whereMessage,
    },
    data: { resolved_at: new Date().toISOString() },
  });
}

/**
 * We have to find a slack installation with access to the given channel, unfortunately there is no mechanism
 * for knowing which slack installation is the right one within the context of a message event.
 * https://github.com/slackapi/bolt-js/issues/1298
 */
async function findSlackUserTokenWithAccessToConversation(teamId: string, channel: string): Promise<string | null> {
  const userSlackInstallations = await db.user_slack_installation.findMany({
    where: { data: { path: ["team", "id"], equals: teamId } },
  });
  const userTokens = await Promise.all(
    userSlackInstallations.map(async ({ data }) => {
      const userToken = (data as unknown as SlackInstallation).user.token;
      if (!userToken) {
        return null;
      }
      try {
        const response = await slackClient.conversations.info({ token: userToken, channel });
        if (response.ok) {
          return userToken;
        }
      } catch (error) {
        if (!isChannelNotFoundError(error)) {
          throw error;
        }
      }
      return null;
    })
  );
  return userTokens.find(Boolean) ?? null;
}

/**
 * Creates notifications for Acapela users who are in the Slack IM conversation in which the message was posted. If the
 * conversation is a Slack channel we only create a notification if it was a mention.
 * TODO:
 * - Optional fetch! This fetches all the conversation members for every messages. To make it less expensive we should
 *   only do the fetch if its not a channel or if there is a mention.
 * - Add pagination! This fetches the first 100 channel members, which is likely more than enough for IMs, but not for
 *   channels
 *   - Same for threads, I have not run into the limit yet but if we want to scale to infinity we'll want to paginate
 */
async function createNotificationsFromMessage(message: GenericMessageEvent) {
  const slackTeamId = assertDefined(message.team, `missing team for message ${JSON.stringify(message)}`);
  const userToken = await findSlackUserTokenWithAccessToConversation(slackTeamId, message.channel);
  if (!userToken) {
    return;
  }

  const { ts: messageTs, thread_ts: threadTs, user: authorSlackUserId } = message;
  const membersResponse = await slackClient.conversations.members({
    token: userToken,
    channel: message.channel,
  });
  const members = new Set(membersResponse.members);

  // An instant message (IM) is either a direct message or a group chat between multiple people, but not a channel.
  const isIM_or_MPIM = message.channel_type == "im" || message.channel_type == "mpim";

  const membersWithoutAuthor = new Set(members);
  membersWithoutAuthor.delete(authorSlackUserId);

  const slackUserIdsToNotify: string[] = [];

  if (threadTs) {
    // For a message posted in a thread, notify all users who posted in the thread or were mentioned in it
    const { messages } = await slackClient.conversations.replies({
      token: userToken,
      channel: message.channel,
      ts: threadTs,
    });
    slackUserIdsToNotify.push(
      ...(messages ?? []).flatMap(({ user: author, text }) =>
        (author && membersWithoutAuthor.has(author) ? [author] : []).concat(
          extractMentionedSlackUserIdsFromMd(text).filter((id) => membersWithoutAuthor.has(id))
        )
      )
    );
  } else if (isIM_or_MPIM) {
    // For IMs outside of threads notify all members of the conversation except for the author
    slackUserIdsToNotify.push(...membersWithoutAuthor);
  }

  // Extract all mentioned users and set/overwrite them as mentions in the slackUsersToNotify Map
  const mentionedMembers = new Set(extractMentionedSlackUserIdsFromMd(message.text).filter((id) => members.has(id)));
  slackUserIdsToNotify.push(...mentionedMembers);

  // Find Acapela users for all the Slack users that would be notified
  const userSlackInstallations = await db.user_slack_installation.findMany({
    where: {
      OR: uniq(slackUserIdsToNotify).map((id) => ({ data: { path: ["user", "id"], equals: id } })),
    },
  });

  if (userSlackInstallations.length == 0) {
    return;
  }

  const [{ permalink }, { user: author }, { channel }] = await Promise.all([
    slackClient.chat.getPermalink({
      token: userToken,
      channel: message.channel,
      message_ts: messageTs,
    }),
    slackClient.users.info({ token: userToken, user: authorSlackUserId }),
    isIM_or_MPIM
      ? // we only need to fetch info for channels, as we use their name for the notification title
        { channel: undefined }
      : slackClient.conversations.info({ token: userToken, channel: message.channel }),
  ]);
  assert(permalink, `could not get permalink for message ${messageTs} in channel ${message.channel}`);
  assert(author, `could not get slack user for id ${authorSlackUserId}`);

  const isIM = message.channel_type == "im";
  // We have to use a transaction due to Prisma not supporting relation-creation within createMany
  await db.$transaction(
    userSlackInstallations.map(({ user_id, data }) =>
      db.notification.create({
        data: {
          user_id,
          from: author.real_name ?? "Unknown",
          url: permalink,
          notification_slack_message: {
            create: {
              slack_conversation_id: message.channel,
              slack_thread_ts: threadTs,
              slack_message_ts: messageTs,
              is_mention: mentionedMembers.has((data as unknown as SlackInstallation).user.id),
              ...(channel
                ? {
                    conversation_name: (channel.is_private ? "🔒" : "#") + channel.name_normalized,
                    is_private_conversation: channel.is_private,
                  }
                : {
                    conversation_name: isIM ? "Direct Message" : "Group Chat",
                    is_private_conversation: true,
                  }),
            },
          },
        },
      })
    )
  );
}

export function setupSlackCapture(app: SlackApp) {
  app.message(async ({ message }) => {
    message = message as GenericMessageEvent;

    if (message.type !== "message" || message.subtype || !message.text) {
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
      await createNotificationsFromMessage(message);
    } catch (error) {
      logger.error(error, "Error creating slack notifications");
    }
  });

  app.event("reaction_added", async ({ event }) => {
    const user = await findUserForSlackInstallation(event.user);
    if (user?.is_slack_auto_resolve_enabled && event.item.type === "message") {
      const { channel, ts } = event.item;
      await resolveMessageNotifications(user.id, { slack_conversation_id: channel, slack_message_ts: ts });
    }
  });
}
