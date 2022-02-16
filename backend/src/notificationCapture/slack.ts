import { Prisma } from "@prisma/client";
import { GenericMessageEvent, App as SlackApp } from "@slack/bolt";
import { WebClient } from "@slack/web-api";
import { SingleASTNode } from "simple-markdown";

import { SlackInstallation, slackClient } from "@aca/backend/src/slack/app";
import { parseAndTransformToTipTapJSON, parseSlackMarkdown } from "@aca/backend/src/slack/md/parser";
import { getUserSlackInstallationFilter } from "@aca/backend/src/slack/userSlackInstallation";
import { UserSlackInstallation, db } from "@aca/db";
import { convertMessageContentToPlainText } from "@aca/richEditor/content/plainText";
import { assert } from "@aca/shared/assert";
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

// A special client authorized with the app token for the few API calls that need app level scopes
const appClient = new WebClient(process.env.SLACK_APP_TOKEN);
async function findUserSlackInstallations(eventContextId: string) {
  const { authorizations } = await appClient.apps.event.authorizations.list({ event_context: eventContextId });
  return db.user_slack_installation.findMany({
    where: {
      OR: (authorizations ?? [])
        .filter((auth) => auth.team_id && auth.user_id)
        .map((auth) => getUserSlackInstallationFilter({ teamId: auth.team_id, userId: auth.user_id })),
    },
  });
}

const createTextPreviewFromSlackMessage = async (
  userToken: string,
  slackMessageText: string,
  mentionedSlackUserIds: string[]
) =>
  convertMessageContentToPlainText(
    parseAndTransformToTipTapJSON(slackMessageText, {
      mentionedNamesBySlackId: Object.fromEntries(
        await Promise.all(
          mentionedSlackUserIds.map(async (slackUserId) => [
            slackUserId,
            (await slackClient.users.info({ token: userToken, user: slackUserId })).user?.real_name ?? "Unknown",
          ])
        )
      ),
    })
  );

// A user is involved in a thread if they have posted in it or were mentioned in it
async function checkIsInvolvedInThread(
  token: string,
  channel: string,
  ts: string,
  slackUserId: string
): Promise<boolean> {
  const { messages } = await slackClient.conversations.replies({ token, channel, ts });
  return (messages ?? []).some(
    (message) =>
      message.user === slackUserId || extractMentionedSlackUserIdsFromMd(message.text).some((id) => id == slackUserId)
  );
}

/**
 * Creates notification for the given user who are in the Slack conversation in which the message was posted. If the
 * conversation is a Slack channel we only create a notification if it was a mention or within a thread.
 */
async function createNotificationFromMessage(
  userSlackInstallation: UserSlackInstallation,
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
    (!is_IM_or_MPIM && !(threadTs && (await checkIsInvolvedInThread(userToken, channel, threadTs, slackUserId))))
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

  await db.notification.create({
    data: {
      user_id: userSlackInstallation.user_id,
      from: authorUser.profile?.real_name ?? authorUser.real_name ?? "Unknown",
      url: permalink,
      text_preview: await createTextPreviewFromSlackMessage(userToken, message.text ?? "", mentionedSlackUserIds),
      notification_slack_message: {
        create: {
          slack_user_id: message.user,
          slack_conversation_id: message.channel,
          slack_thread_ts: threadTs,
          slack_message_ts: messageTs,
          is_mention: isMentioned,
          conversation_type: message.channel_type,
          conversation_name: slackChannel
            ? (slackChannel.is_private ? "🔒" : "#") + slackChannel.name_normalized
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
    const user = await findUserForSlackInstallation(event.user);
    if (user?.is_slack_auto_resolve_enabled && event.item.type === "message") {
      const { channel, ts } = event.item;
      await resolveMessageNotifications(user.id, { slack_conversation_id: channel, slack_message_ts: ts });
    }
  });
}
