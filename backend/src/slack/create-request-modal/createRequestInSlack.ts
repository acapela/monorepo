import * as Sentry from "@sentry/node";
import { WebClient } from "@slack/web-api";
import { Blocks, Modal } from "slack-block-builder";

import { backendGetTopicUrl } from "~backend/src/topics/url";
import { db } from "~db";
import { assert } from "~shared/assert";
import { trackBackendUserEvent } from "~shared/backendAnalytics";
import { Maybe } from "~shared/types";
import { Origin } from "~shared/types/analytics";
import { MENTION_OBSERVER, MentionType } from "~shared/types/mention";

import { isWebAPIErrorType } from "../errors";
import { LiveTopicMessage } from "../live-messages/LiveTopicMessage";
import { buildDateTimePerUserTimezone, createTeamMemberUserFromSlack, findUserBySlackId } from "../utils";
import { SlackUserIdWithRequestType, createTopicForSlackUsers } from "./createTopicForSlackUsers";

interface CreateRequestInSlackInput {
  messageText?: Maybe<string>;
  slackTeamId?: Maybe<string>;
  creatorSlackUserId: string;
  requestType: MentionType;
  requestForSlackUserIds: string[];
  observersSlackUserIds?: Maybe<string[]>;
  origin?: Origin;
  token: string;
  originalChannelId?: Maybe<string>;
  conversationId?: Maybe<string>;
  client: WebClient;
  triggerId: string;
  dueAtDate?: Maybe<string>;
  dueAtHour?: Maybe<string>;
  botToken?: Maybe<string>;
  messageTs?: Maybe<string>;
  topicName?: Maybe<string>;
  priority?: Maybe<string>;
  decisionOptions: string[];
  isFirstReplyEnough: boolean;
}

// TODO: Split this function to require prepared data and only handle creating and tracking slack message instead of doing all request preparation
export async function createAndTrackRequestInSlack({
  messageText,
  slackTeamId,
  creatorSlackUserId,
  requestType,
  requestForSlackUserIds,
  observersSlackUserIds = [],
  origin = "unknown",
  token,
  originalChannelId,
  conversationId,
  client,
  triggerId,
  dueAtDate,
  dueAtHour,
  messageTs,
  botToken,
  topicName,
  priority,
  decisionOptions = [],
  isFirstReplyEnough,
}: CreateRequestInSlackInput) {
  assert(messageText, "create_request called with wrong arguments");

  assert(slackTeamId, "must have slack team id");

  const ownerSlackUserId = creatorSlackUserId;

  const team = await db.team.findFirst({ where: { team_slack_installation: { slack_team_id: slackTeamId } } });

  assert(team, `must have a team for slack team ${slackTeamId}`);

  const owner =
    (await findUserBySlackId(token, ownerSlackUserId, team.id)) ??
    (await createTeamMemberUserFromSlack(token, ownerSlackUserId, team.id)).user;

  const slackUserIdsWithMentionType: SlackUserIdWithRequestType[] = requestForSlackUserIds.map((id) => ({
    slackUserId: id,
    mentionType: requestType,
  }));

  // add mentioned users from message as observers
  observersSlackUserIds?.forEach((id) => {
    slackUserIdsWithMentionType.push({
      slackUserId: id,
      mentionType: MENTION_OBSERVER,
    });
  });

  // When a request is created from a message, add message author as observer
  const hasRequestOriginatedFromMessageAction = origin === "slack-message-action";

  const dueAt: Date | null =
    dueAtDate || dueAtHour
      ? await buildDateTimePerUserTimezone(client as never, ownerSlackUserId, dueAtDate, dueAtHour)
      : null;

  const topic = await createTopicForSlackUsers({
    token,
    teamId: team.id,
    ownerId: owner.id,
    ownerSlackUserId,
    slackTeamId,
    rawTopicMessage: messageText,
    topicName,
    dueAt,
    slackUserIdsWithMentionType,
    priority,
    decisionOptions,
    isFirstReplyEnough,
  });

  if (!originalChannelId) {
    const topicURL = await backendGetTopicUrl(topic);
    await client.views.open({
      trigger_id: triggerId,
      view: Modal({ title: "Request created" })
        .blocks(Blocks.Section({ text: `You can find your request in you sidebar or behind this link:\n${topicURL}` }))
        .buildToObject(),
    });
  }

  if (!conversationId) {
    return;
  }

  try {
    if (conversationId && botToken == token) {
      // try to join the channel in case the bot is not in it already
      await client.conversations.join({ token, channel: conversationId });
    }
  } catch (error) {
    if (!isWebAPIErrorType(error, "method_not_supported_for_channel_type")) {
      throw error;
    }
  }

  const response = await client.chat.postMessage({
    ...(await LiveTopicMessage(topic, { isMessageContentExcluded: hasRequestOriginatedFromMessageAction })),
    token,
    channel: conversationId,
    thread_ts: messageTs ?? undefined,
  });

  if (!response.ok) {
    assert(response.error, "non-ok response without an error");
    Sentry.captureException(response.error);
    return;
  }

  const { channel, message } = response;
  assert(channel && message?.ts, "ok response without channel or message_ts");
  await db.topic_slack_message.create({
    data: {
      topic_id: topic.id,
      slack_channel_id: channel,
      slack_message_ts: message.ts,
      is_excluding_content: hasRequestOriginatedFromMessageAction,
    },
  });

  if (owner) {
    trackBackendUserEvent(owner.id, "Created Request", {
      origin: origin,
      topicName: topic.name,
    });
  }
}
