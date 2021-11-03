import Sentry from "@sentry/node";
import { App, GlobalShortcut, MessageShortcut } from "@slack/bolt";
import { Blocks, Modal } from "slack-block-builder";

import { slackClient } from "~backend/src/slack/app";
import { db } from "~db";
import { assert, assertDefined } from "~shared/assert";
import { trackBackendUserEvent } from "~shared/backendAnalytics";
import { routes } from "~shared/routes";
import { MentionType } from "~shared/types/mention";

import { LiveTopicMessage } from "../LiveTopicMessage";
import { assertToken, findUserBySlackId, listenToViewWithMetadata } from "../utils";
import { createTopicForSlackUsers } from "./createTopicForSlackUsers";
import { tryOpenRequestModal } from "./tryOpenRequestModal";

const SLASH_COMMAND = "/" + process.env.SLACK_SLASH_COMMAND;
const SHORTCUT = { callback_id: "global_acapela", type: "shortcut" } as const as GlobalShortcut;
const MESSAGE_ACTION = { callback_id: "message_acapela", type: "message_action" } as const as MessageShortcut;

export function setupRequestModal(app: App) {
  app.command(SLASH_COMMAND, async ({ command, ack, context, body }) => {
    const { trigger_id: triggerId, channel_id: channelId, user_id: slackUserId, team_id: slackTeamId } = command;
    const { user } = await tryOpenRequestModal(assertToken(context), triggerId, {
      channelId,
      slackUserId,
      slackTeamId,
      origin: "slack-command",
      messageText: body.text,
    });

    await ack();

    if (user) {
      trackBackendUserEvent(user.id, "Used Slack Slash Command", {
        slackUserName: command.user_name,
        commandName: SLASH_COMMAND,
      });
    }
  });

  app.shortcut(SHORTCUT, async ({ shortcut, ack, body, context }) => {
    const { user } = await tryOpenRequestModal(assertToken(context), shortcut.trigger_id, {
      slackUserId: body.user.id,
      slackTeamId: assertDefined(body.team?.id, "must have slack team"),
      origin: "slack-shortcut",
    });

    await ack();

    if (user) {
      trackBackendUserEvent(user.id, "Used Slack Global Shortcut", { slackUserName: body.user.username });
    }
  });

  app.shortcut(MESSAGE_ACTION, async ({ shortcut, ack, body, context }) => {
    const { channel, message, trigger_id } = shortcut;
    const { user } = await tryOpenRequestModal(assertToken(context), trigger_id, {
      channelId: channel.id,
      slackUserId: body.user.id,
      slackTeamId: assertDefined(body.team?.id, "must have slack team"),
      messageText: message.text || "",
      origin: "slack-message-action",
    });

    await ack();

    if (user) {
      trackBackendUserEvent(user.id, "Used Slack Message Action", { slackUserName: body.user.name });
    }
  });

  listenToViewWithMetadata(app, "open_request_modal", async ({ ack, context, body, metadata }) => {
    await ack();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await tryOpenRequestModal(assertToken(context), (body as any).trigger_id, metadata);
  });

  listenToViewWithMetadata(app, "create_request", async ({ ack, view, body, client, context, metadata }) => {
    const {
      topic_block: {
        topic_name: { value: topicName },
      },
      members_block: {
        members_select: { selected_users: members },
      },
      request_type_block: {
        request_type_select: { selected_option: requestType },
      },
    } = view.state.values;

    const messageText = metadata.messageText || view.state.values.message_block.message_text.value;
    if (!(members && requestType && messageText && members.length > 0)) {
      return await ack({
        response_action: "errors",
        errors: {
          members_block: "You need to assign at least one user.",
        },
      });
    }

    const token = assertToken(context);

    const slackTeamId = body.user.team_id;
    assert(slackTeamId, "must have slack team id");

    const [team, owner] = await Promise.all([
      db.team.findFirst({ where: { team_slack_installation: { slack_team_id: slackTeamId } } }),
      findUserBySlackId(token, body.user.id),
    ]);

    assert(team, "must have a team");
    assert(owner, "must have a user");

    const slackUserIdsWithMentionType: { slackUserId: string; mentionType?: MentionType }[] = members.map((id) => ({
      slackUserId: id,
      mentionType: requestType.value as MentionType,
    }));

    const channelId = metadata.channelId ?? view.state.values.channel_block.channel_select.selected_channel;

    if (channelId) {
      const response = await slackClient.conversations.members({ token, channel: channelId });
      if (response.members) {
        slackUserIdsWithMentionType.push(...response.members.map((id) => ({ slackUserId: id })));
      }
    }

    const topic = await createTopicForSlackUsers({
      token,
      teamId: team.id,
      ownerId: owner.id,
      slackTeamId,
      rawTopicMessage: messageText,
      topicName,
      slackUserIdsWithMentionType,
    });

    if (!topic) {
      return await ack({
        response_action: "errors",
        errors: {
          request_type_block: "Topic creation failed",
        },
      });
    }

    if (!channelId) {
      const topicURL = process.env.FRONTEND_URL + routes.topic({ topicSlug: topic.slug });
      await ack({
        response_action: "update",
        view: Modal({ title: "Request created" })
          .blocks(
            Blocks.Section({ text: `You can find your request in you sidebar or behind this link:\n${topicURL}` })
          )
          .buildToObject(),
      });
      return;
    }

    await ack({ response_action: "clear" });

    const response = await client.chat.postMessage({
      ...(await LiveTopicMessage(topic)),
      token,
      channel: channelId,
    });

    if (!response.ok) {
      assert(response.error, "non-ok response without an error");
      Sentry.captureException(response.error);
      return;
    }

    const { channel, message } = response;
    assert(channel && message?.ts, "ok response without channel or message_ts");
    await db.topic_slack_message.create({
      data: { topic_id: topic.id, slack_channel_id: channel, slack_message_ts: message.ts },
    });

    if (owner) {
      trackBackendUserEvent(owner.id, "Created Topic", {
        origin: metadata.origin,
        topicName: topic.name,
      });
    }
  });
}
