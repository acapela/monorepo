import { Prisma } from "@prisma/client";
import { GenericMessageEvent, App as SlackApp } from "@slack/bolt";
import { WebClient } from "@slack/web-api";
import { User as SlackUser } from "@slack/web-api/dist/response/UsersInfoResponse";
import { SingleASTNode } from "simple-markdown";

import { SlackInstallation, slackClient } from "@aca/backend/src/slack/app";
import { parseAndTransformToTipTapJSON, parseSlackMarkdown } from "@aca/backend/src/slack/md/parser";
import { getUserSlackInstallationFilter } from "@aca/backend/src/slack/userSlackInstallation";
import { UserSlackInstallation, db } from "@aca/db";
import { convertMessageContentToPlainText } from "@aca/richEditor/content/plainText";
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

async function findOrCreateMessageActor(authorSlackUserId: string, authorSlackUser: SlackUser) {
  const actor = await db.user.findFirst({
    where: { service_user: { some: { service: "slack", service_user_id: authorSlackUserId } } },
  });
  if (actor) {
    return actor;
  }

  const email = assertDefined(authorSlackUser.profile?.email, `missing email for slack user ${authorSlackUserId}`);
  const name = assertDefined(authorSlackUser.name, `missing name for slack user ${authorSlackUserId}`);
  const serviceUser = await db.service_user.create({
    data: {
      service_serviceToservice_user: { connect: { value: "slack" } },
      service_user_id: authorSlackUserId,
      display_name: name,
      user: { connectOrCreate: { where: { email }, create: { email, name } } },
    },
    include: { user: true },
  });
  return serviceUser.user;
}

/**
 * Creates notification for the given user who are in the Slack IM conversation in which the message was posted. If the
 * conversation is a Slack channel we only create a notification if it was a mention.
 * TODO:
 * - Optional fetch! This fetches all the conversation members for every messages. To make it less expensive we should
 *   only do the fetch if its not a channel or if there is a mention.
 * - Add pagination! This fetches the first 100 channel members, which is likely more than enough for IMs, but not for
 *   channels
 *   - Same for threads, I have not run into the limit yet but if we want to scale to infinity we'll want to paginate
 */
async function createNotificationFromMessage(
  userSlackInstallation: UserSlackInstallation,
  message: GenericMessageEvent
) {
  const slackInstallData = userSlackInstallation.data as unknown as SlackInstallation;
  const { id: slackUserId, token: userToken } = slackInstallData.user;
  const mentionedSlackUserIds = new Set(extractMentionedSlackUserIdsFromMd(message.text));
  const isMentioned = mentionedSlackUserIds.has(slackUserId);
  if (!userToken || (message.user === slackUserId && !isMentioned)) {
    // We only want to create notifications for messages from the user to themselves, if it is a mention
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

  if (!isIM_or_MPIM && threadTs) {
    // For a message posted in a thread, notify the user if they posted in the thread or were mentioned in it
    const { messages } = await slackClient.conversations.replies({
      token: userToken,
      channel: message.channel,
      ts: threadTs,
    });
    const hasPostedOrIsMentionedInThread = (messages ?? []).some(
      (message) =>
        message.user === slackUserId || extractMentionedSlackUserIdsFromMd(message.text).some((id) => id == slackUserId)
    );
    if (!hasPostedOrIsMentionedInThread) {
      return;
    }
  }

  const [{ permalink }, { user: authorUser }, { channel }] = await Promise.all([
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
  assert(authorUser, `could not get slack profile for id ${authorSlackUserId}`);

  const textPreview = await createTextPreviewFromSlackMessage(
    userToken,
    message.text ?? "",
    Array.from(mentionedSlackUserIds)
  );

  const actor = authorUser.profile?.email ? await findOrCreateMessageActor(authorSlackUserId, authorUser) : null;

  await db.notification.create({
    data: {
      user_id: userSlackInstallation.user_id,
      from: authorUser.real_name ?? "Unknown",
      actor_id: actor?.id ?? undefined,
      url: permalink,
      text_preview: textPreview,
      notification_slack_message: {
        create: {
          slack_user_id: message.user,
          slack_conversation_id: message.channel,
          slack_thread_ts: threadTs,
          slack_message_ts: messageTs,
          is_mention: isMentioned,
          conversation_type: message.channel_type,
          conversation_name: channel
            ? (channel.is_private ? "🔒" : "#") + channel.name_normalized
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
