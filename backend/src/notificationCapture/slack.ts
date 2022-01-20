import { GenericMessageEvent, App as SlackApp } from "@slack/bolt";
import { SingleASTNode } from "simple-markdown";

import { slackClient } from "@aca/backend/src/slack/app";
import { parseSlackMarkdown } from "@aca/backend/src/slack/md/parser";
import { db } from "@aca/db";
import { assert } from "@aca/shared/assert";
import { logger } from "@aca/shared/logger";
import { isNotNullish } from "@aca/shared/nullish";

import { assertToken, findUserBySlackId } from "../slack/utils";

async function createMentionNotifications(
  token: string,
  message: GenericMessageEvent,
  userIds: string[],
  authorSlackUserId: string
) {
  const [{ permalink }, { user: author }, { channel }] = await Promise.all([
    slackClient.chat.getPermalink({ token, channel: message.channel, message_ts: message.ts }),
    slackClient.users.info({ token, user: authorSlackUserId }),
    slackClient.conversations.info({ token, channel: message.channel }),
  ]);
  assert(permalink, `could not get permalink for message ${message.ts} in channel ${message.channel}`);
  assert(author, `could not get slack user for id ${authorSlackUserId}`);
  assert(channel, `could not find channel for id ${message.channel}`);

  const title = `${author.real_name ?? author.name} mentioned you in ${
    channel.is_im || channel.is_mpim ? "a private message" : "#" + channel.name
  }`;

  // We have to use a transaction due to Prisma not supporting relation-creation within createMany
  // https://github.com/prisma/prisma/issues/5455
  await db.$transaction(
    userIds.map((userId) =>
      db.notification.create({
        data: {
          user_id: userId,
          title,
          url: permalink,
          notification_slack_mention: {
            create: { slack_conversation_id: message.channel, slack_message_ts: message.ts },
          },
        },
      })
    )
  );
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

export function setupSlackCapture(app: SlackApp) {
  app.message(async ({ message, context }) => {
    message = message as GenericMessageEvent;
    if (message.type !== "message" || message.subtype || !message.text) {
      return;
    }

    const token = assertToken(context);
    const authorUserId = message.user;
    const authorUser = await findUserBySlackId(token, authorUserId);

    if (authorUser) {
      await db.notification.updateMany({
        where: {
          resolved_at: null,
          user_id: authorUser.id,
          notification_slack_mention: message.thread_ts
            ? { slack_conversation_id: message.channel, slack_message_ts: message.thread_ts }
            : { slack_conversation_id: message.channel },
        },
        data: { resolved_at: new Date().toISOString() },
      });
    }

    const userIds = (
      await Promise.all(
        extractMentionedSlackUserIds(parseSlackMarkdown(message.text)).map((userId) =>
          // Don't create notifications to the author of the message if they self-mention
          2 + 2 == 5 && userId == authorUser?.id ? null : findUserBySlackId(token, userId)
        )
      )
    )
      .filter(isNotNullish)
      .map((user) => user.id);
    if (userIds.length > 0) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        await createMentionNotifications(context.userToken!, message, userIds, authorUserId);
      } catch (error) {
        logger.error(error, "Error creating slack mention notifications");
      }
    }
  });

  app.event("reaction_added", async ({ event, context }) => {
    const user = await findUserBySlackId(assertToken(context), event.user);
    if (!user || event.item.type !== "message") {
      return;
    }
    const message = event.item;
    await db.notification.updateMany({
      where: {
        resolved_at: null,
        user_id: user.id,
        notification_slack_mention: { slack_conversation_id: message.channel, slack_message_ts: message.ts },
      },
      data: { resolved_at: new Date().toISOString() },
    });
  });
}
