import * as Sentry from "@sentry/node";
import { WebClient } from "@slack/web-api";
import { compact, map, uniq } from "lodash";
import { Blocks, Elements, Md, Modal, Message as SlackMessage } from "slack-block-builder";

import { updateHomeView } from "@aca/backend/src/slack/home-tab";
import { createTopicLink } from "@aca/backend/src/slack/live-messages/utils";
import { parseAndTransformToTipTapJSON } from "@aca/backend/src/slack/md/parser";
import { backendGetTopicUrl } from "@aca/backend/src/topics/url";
import { db } from "@aca/db";
import { assert, assertDefined } from "@aca/shared/assert";
import { trackBackendUserEvent } from "@aca/shared/backendAnalytics";
import { MENTION_TYPE_KEY, getMentionNodesFromContent } from "@aca/shared/editor/mentions";
import { MENTION_OBSERVER, MentionType, REQUEST_NOTIFICATION_LABELS, RequestType } from "@aca/shared/requests";
import { Maybe } from "@aca/shared/types";
import { Origin } from "@aca/shared/types/analytics";
import { EditorMentionData } from "@aca/shared/types/editor";

import { isWebAPIErrorType } from "../errors";
import { LiveTopicMessage, LiveTopicMessageTopic } from "../live-messages/LiveTopicMessage";
import { SlackActionIds, createTeamMemberUserFromSlack, fetchTeamBotToken, findUserBySlackId } from "../utils";
import {
  SlackUserIdWithRequestType,
  UserWithMaybeMentionType,
  createTopicForSlackUsers,
  findOrInviteUsers,
} from "./createTopicForSlackUsers";

function transformSlackMessageIntoTipTapWithMentions(
  rawMessage: string,
  slackTeamId: string,
  usersWithRequestType: (UserWithMaybeMentionType & { mentionType: MentionType })[]
) {
  const mentionedUsersBySlackId = Object.fromEntries(
    usersWithRequestType.map((u) => [
      u.slackUserId,
      {
        type: u.mentionType,
        userId: u.userId,
      },
    ])
  );

  const messageContent = parseAndTransformToTipTapJSON(rawMessage, {
    slackTeamId,
    mentionedUsersBySlackId,
  });

  const alreadyMentionedUsers = new Set(
    uniq(compact(map(getMentionNodesFromContent(messageContent), "attrs.data.userId")))
  );

  const extraMentionNodes = usersWithRequestType
    .filter(({ userId }) => !alreadyMentionedUsers.has(userId))
    .flatMap(({ userId, mentionType }) => {
      const data: EditorMentionData = { userId, type: mentionType };
      return [
        { type: MENTION_TYPE_KEY, attrs: { data } },
        { type: "text", text: " " },
      ];
    });

  if (extraMentionNodes.length) {
    messageContent.content.unshift(
      {
        type: "paragraph",
        content: extraMentionNodes,
      },
      {
        type: "paragraph",
        content: [],
      }
    );
  }
  return messageContent;
}

export async function createLiveMessage({
  client,
  topic,
  hasRequestOriginatedFromMessageAction,
  conversationId,
  token,
  messageTs,
}: {
  client: WebClient;
  topic: LiveTopicMessageTopic;
  hasRequestOriginatedFromMessageAction: boolean;
  conversationId: string;
  token: string;
  messageTs?: string;
}) {
  const response = await client.chat.postMessage({
    ...(await LiveTopicMessage(topic, { isMessageContentExcluded: hasRequestOriginatedFromMessageAction })),
    token,
    channel: conversationId,
    thread_ts: messageTs,
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
}

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
  dueAt?: Maybe<Date>;
  botToken?: Maybe<string>;
  messageTs?: Maybe<string>;
  topicName?: Maybe<string>;
  priority?: Maybe<string>;
  decisionOptions?: string[];
  isFirstCompletionEnough: boolean;
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
  dueAt,
  messageTs,
  botToken,
  topicName,
  priority,
  decisionOptions,
  isFirstCompletionEnough,
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
  const hasRequestOriginatedFromMessageAction =
    origin === "slack-quick-message-action" || origin === "slack-modal-message-action";

  const usersWithMentionType = await findOrInviteUsers({
    slackToken: token,
    teamId: team.id,
    invitingUserId: owner.id,
    slackUserIdsWithMentionType,
  });
  const messageContent = transformSlackMessageIntoTipTapWithMentions(
    messageText,
    slackTeamId,
    usersWithMentionType.filter((u) => u.mentionType) as never
  );
  const topic = await createTopicForSlackUsers({
    teamId: team.id,
    ownerId: owner.id,
    topicName,
    dueAt,
    messageContent,
    priority,
    decisionOptions: decisionOptions ?? [],
    isFirstCompletionEnough,
    usersWithMentionType,
  });

  await updateHomeView(
    botToken ?? assertDefined(await fetchTeamBotToken(team.id), `must have bot token for team ${team.id}`),
    ownerSlackUserId
  );

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
  const isPrivateTask = origin === "slack-quick-message-action";

  if (isPrivateTask) {
    const mentionType = slackUserIdsWithMentionType[0].mentionType;
    const messageText =
      Md.bold(`[Acapela request] ${await createTopicLink(topic)}`) +
      `\n${Md.bold(REQUEST_NOTIFICATION_LABELS[mentionType as RequestType])} created for ` +
      Md.user(ownerSlackUserId);
    const response = await client.chat.postEphemeral({
      ...SlackMessage({ text: messageText })
        .blocks([
          Blocks.Section({ text: messageText }),
          Blocks.Actions().elements(
            Elements.Button({
              actionId: SlackActionIds.PostSelfRequestInChannel,
              value: `${topic.id}/${hasRequestOriginatedFromMessageAction}/${conversationId}/${messageTs || ""}`,
              text: "Post in channel",
            }).primary(true)
          ),
        ])
        .buildToObject(),
      token,
      user: ownerSlackUserId,
      channel: conversationId,
      thread_ts: messageTs ?? undefined,
    });
    if (!response.ok) {
      assert(response.error, "non-ok response without an error");
      Sentry.captureException(response.error);
      return;
    }
  } else {
    await createLiveMessage({
      client,
      topic,
      hasRequestOriginatedFromMessageAction,
      conversationId,
      token,
      messageTs: messageTs ?? undefined,
    });
  }

  if (owner) {
    trackBackendUserEvent(owner.id, "Created Request", {
      origin: origin,
      topicName: topic.name,
    });
  }
}
