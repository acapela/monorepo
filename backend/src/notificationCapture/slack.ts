import { Prisma } from "@prisma/client";
import { GenericMessageEvent, App as SlackApp } from "@slack/bolt";
import { SingleASTNode } from "simple-markdown";

import { slackClient } from "@aca/backend/src/slack/app";
import { parseSlackMarkdown } from "@aca/backend/src/slack/md/parser";
import { db } from "@aca/db";
import { assert } from "@aca/shared/assert";
import { logger } from "@aca/shared/logger";
import { isNotNullish } from "@aca/shared/nullish";

import { assertToken, findUserBySlackId } from "../slack/utils";

function extractMentionedSlackUserIds(nodes: SingleASTNode[]): string[] {
  return nodes.flatMap((node) => {
    if (Array.isArray(node.content)) {
      return extractMentionedSlackUserIds(node.content);
    } else {
      return node.type == "slackUser" ? [node.id] : [];
    }
  });
}

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
 * Creates notifications for Acapela users who are in the Slack IM conversation in which the message was posted. If the
 * conversation is a Slack channel we only create a notification if it was a mention.
 * TODO:
 * - Optional fetch! This fetches all the conversation members for every messages. To make it less expensive we should
 *   only do the fetch if its not a channel or if there is a mention.
 * - Add pagination! This fetches the first 100 channel members, which is likely more than enough for IMs, but not for
 *   channels
 */
async function createNotificationsFromMessage(userToken: string, message: GenericMessageEvent) {
  const authorSlackUserId = message.user;
  const membersResponse = await slackClient.conversations.members({
    token: userToken,
    channel: message.channel,
  });
  const members = new Set(membersResponse.members);

  // An instant message (IM) is either a direct message or a group chat between multiple people, but not a channel.
  const isIM_or_MPIM = message.channel_type == "im" || message.channel_type == "mpim";

  // For IMs initialize the Map with all conversation members (apart from the author)
  const membersWithoutAuthor = Array.from(members).filter((slackUserId) => slackUserId != authorSlackUserId);
  const slackUserIdsToNotify = new Map<string, { isMention: boolean }>(
    isIM_or_MPIM ? membersWithoutAuthor.map((slackUserId) => [slackUserId, { isMention: false }]) : undefined
  );

  // Extract all mentioned users and set/overwrite them as mentions in the slackUsersToNotify Map
  const mentionedSlackUserIds = extractMentionedSlackUserIds(parseSlackMarkdown(message.text ?? "")).filter(
    (slackUserId) => members.has(slackUserId)
  );
  for (const slackUserId of mentionedSlackUserIds) {
    slackUserIdsToNotify.set(slackUserId, { isMention: true });
  }

  // Find Acapela users for all the Slack users that would be notified
  const usersToNotify = (
    await Promise.all(
      Array.from(slackUserIdsToNotify).map(([slackUserId, { isMention }]) =>
        findUserBySlackId(userToken, slackUserId).then((user) => (user ? { userId: user.id, isMention } : null))
      )
    )
  ).filter(isNotNullish);

  if (usersToNotify.length == 0) {
    return;
  }

  const [{ permalink }, { user: author }, { channel }] = await Promise.all([
    slackClient.chat.getPermalink({
      token: userToken,
      channel: message.channel,
      message_ts: message.ts,
    }),
    slackClient.users.info({ token: userToken, user: authorSlackUserId }),
    isIM_or_MPIM
      ? { channel: undefined }
      : slackClient.conversations.info({ token: userToken, channel: message.channel }),
  ]);
  assert(permalink, `could not get permalink for message ${message.ts} in channel ${message.channel}`);
  assert(author, `could not get slack user for id ${authorSlackUserId}`);

  const threadTs = message.thread_ts;
  const isIM = message.channel_type == "im";
  // We have to use a transaction due to Prisma not supporting relation-creation within createMany
  await db.$transaction(
    usersToNotify.map(({ userId, isMention }) =>
      db.notification.create({
        data: {
          user_id: userId,
          from: author.real_name ?? "Unknown",
          url: permalink,
          notification_slack_message: {
            create: {
              slack_conversation_id: message.channel,
              slack_thread_ts: threadTs,
              slack_message_ts: message.ts,
              is_mention: isMention,
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
  app.message(async ({ message, context }) => {
    message = message as GenericMessageEvent;

    if (message.type !== "message" || message.subtype || !message.text) {
      return;
    }

    const authorUser = await findUserBySlackId(assertToken(context), message.user);

    if (authorUser) {
      try {
        const threadTs = message.thread_ts;
        await resolveMessageNotifications(authorUser.id, {
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await createNotificationsFromMessage(context.userToken!, message);
    } catch (error) {
      logger.error(error, "Error creating slack notifications");
    }
  });

  app.event("reaction_added", async ({ event, context }) => {
    const user = await findUserBySlackId(assertToken(context), event.user);
    if (user && event.item.type === "message") {
      const message = event.item;
      await resolveMessageNotifications(user.id, {
        slack_conversation_id: message.channel,
        slack_message_ts: message.ts,
      });
    }
  });
}
