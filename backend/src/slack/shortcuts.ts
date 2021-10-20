import { App, GlobalShortcut, MessageShortcut } from "@slack/bolt";
import { ViewsOpenArguments } from "@slack/web-api";
import { IncomingWebhook } from "@slack/webhook";

import { createTopicForSlackUsers } from "~backend/src/slack/createTopicForSlackUsers";
import { db } from "~db";
import { assert } from "~shared/assert";
import { trackBackendUserEvent } from "~shared/backendAnalytics";
import { routes } from "~shared/routes";
import { MentionType, REQUEST_READ, REQUEST_RESPONSE } from "~shared/types/mention";

import { parseAndTransformToTipTapJSON } from "./slackMarkdown/parser";
import { createLinkSlackWithAcapelaView, findUserBySlackId } from "./utils";

const ACAPELA_GLOBAL = { callback_id: "global_acapela", type: "shortcut" } as const as GlobalShortcut;
const ACAPELA_MESSAGE = { callback_id: "message_acapela", type: "message_action" } as const as MessageShortcut;

type ShortcutMetadata = { userId: string } & (
  | { isMessageShortcut: false }
  | { isMessageShortcut: true; channelId: string; messageTs: string; responseURL: string }
);

const createTopicModalView = ({
  triggerId,
  messageText,
  metadata,
}: {
  triggerId: string;
  messageText: string;
  metadata: ShortcutMetadata;
}): ViewsOpenArguments => ({
  trigger_id: triggerId,
  view: {
    type: "modal",
    callback_id: "create_topic_modal",
    title: { type: "plain_text", text: "Create a new request" },
    blocks: [
      {
        type: "input",
        block_id: "topic_block",
        label: { type: "plain_text", text: "Topic Title" },
        element: {
          type: "plain_text_input",
          action_id: "topic_name",
          placeholder: { type: "plain_text", text: "Eg feedback for Figma v12" },
        },
      },
      {
        type: "section",
        block_id: "members_block",
        text: { type: "mrkdwn", text: "Request to" },
        accessory: { action_id: "members_select", type: "multi_users_select" },
      },
      {
        type: "input",
        block_id: "request_type_block",
        label: { type: "plain_text", text: "Type" },
        element: {
          type: "static_select",
          action_id: "request_type_select",
          initial_option: { text: { type: "plain_text", text: "Read Request" }, value: REQUEST_READ },
          options: [
            {
              text: { type: "plain_text", text: "Read Request" },
              value: REQUEST_READ,
            },
            {
              text: { type: "plain_text", text: "Response Request" },
              value: REQUEST_RESPONSE,
            },
          ],
        },
      },
      {
        type: "input",
        block_id: "message_block",
        label: { type: "plain_text", text: "Request Message" },
        element: {
          type: "plain_text_input",
          action_id: "topic_message",
          multiline: true,
          initial_value: messageText,
        },
      },
    ],
    submit: { type: "plain_text", text: "Create" },
    private_metadata: JSON.stringify(metadata),
  },
});

export function setupSlackShortcuts(slackApp: App) {
  slackApp.shortcut(ACAPELA_GLOBAL, async ({ shortcut, ack, client, body, context }) => {
    await ack();

    const user = await findUserBySlackId(context.botToken || body.token, body.user.id);

    if (!user) {
      await client.views.open(createLinkSlackWithAcapelaView({ triggerId: shortcut.trigger_id }));
      return;
    }

    await client.views.open(
      createTopicModalView({
        triggerId: shortcut.trigger_id,
        messageText: "",
        metadata: { userId: shortcut.user.id, isMessageShortcut: false },
      })
    );

    if (user) {
      trackBackendUserEvent(user.id, "Used Slack Global Shortcut");
    }
  });

  slackApp.shortcut(ACAPELA_MESSAGE, async ({ shortcut, ack, client, body, context }) => {
    await ack();

    const user = await findUserBySlackId(context.botToken || body.token, body.user.id);

    if (!user) {
      await client.views.open(createLinkSlackWithAcapelaView({ triggerId: shortcut.trigger_id }));
      return;
    }

    await client.views.open(
      createTopicModalView({
        triggerId: shortcut.trigger_id,
        messageText: shortcut.message.text || "",
        metadata: {
          userId: shortcut.user.id,
          isMessageShortcut: true,
          messageTs: shortcut.message_ts,
          channelId: shortcut.channel.id,
          responseURL: shortcut.response_url,
        },
      })
    );

    if (user) {
      trackBackendUserEvent(user.id, "Used Slack Message Action");
    }
  });

  slackApp.action("members_select", ({ ack }) => ack());

  slackApp.view("create_topic_modal", async ({ ack, view, body, client, context }) => {
    const {
      topic_block: {
        topic_name: { value: topicName },
      },
      message_block: {
        topic_message: { value: rawTopicMessage },
      },
      members_block: {
        members_select: { selected_users: members },
      },
      request_type_block: {
        request_type_select: { selected_option: requestType },
      },
    } = view.state.values;

    if (!(topicName && rawTopicMessage && members && requestType)) {
      return ack({
        response_action: "errors",
        errors: { room_block: "Sorry, this isn’t valid input" },
      });
    }

    const token = context.botToken || body.token;
    const [team, owner] = await Promise.all([
      db.team.findFirst({ where: { team_slack_installation: { slack_team_id: body.user.team_id } } }),
      findUserBySlackId(token, body.user.id),
    ]);

    assert(team, "must have a team");
    assert(owner, "must have a user");

    const topic = await createTopicForSlackUsers({
      token,
      teamId: team.id,
      ownerId: owner.id,
      topicName,
      topicMessage: parseAndTransformToTipTapJSON(rawTopicMessage, {
        slackTeamId: body.user.team_id,
      }),
      slackUserIdsWithRequestType: members.map((id) => ({
        slackUserId: id,
        requestType: requestType.value as MentionType,
      })),
    });

    if (!topic) {
      return await ack({
        response_action: "errors",
        errors: {
          email_address: "Topic creation failed",
        },
      });
    }

    await ack({ response_action: "clear" });

    const metadata = JSON.parse(view.private_metadata) as ShortcutMetadata;
    const topicURL = process.env.FRONTEND_URL + routes.topic({ topicSlug: topic.slug });
    if (metadata.isMessageShortcut) {
      await new IncomingWebhook(metadata.responseURL).send({
        response_type: "in_channel",
        text: `<@${metadata.userId}> has created a new request using Acapela!\n${topicURL}`,
        channel: metadata.channelId,
        thread_ts: metadata.messageTs,
      } as never);
    } else {
      await client.chat.postMessage({
        channel: metadata.userId,
        text: `Your request was created on Acapela: ${topicURL}`,
      });
    }

    if (owner) {
      trackBackendUserEvent(owner.id, "Created Topic", {
        origin: metadata.isMessageShortcut ? "slack-message-action" : "slack-shortcut",
        topicName: topicName,
      });
    }
  });
}
