import * as Sentry from "@sentry/node";
import { App, GlobalShortcut, MessageShortcut, ViewSubmitAction } from "@slack/bolt";
import { format } from "date-fns";
import { Bits, Blocks, Elements, Md, Message, Modal } from "slack-block-builder";

import { db } from "~db";
import { assert, assertDefined } from "~shared/assert";
import { trackBackendUserEvent } from "~shared/backendAnalytics";
import { getNextWorkDayEndOfDay } from "~shared/dates/times";
import { routes } from "~shared/routes";
import { MentionType } from "~shared/types/mention";

import { LiveTopicMessage } from "../LiveTopicMessage";
import { SlackActionIds, assertToken, findUserBySlackId, listenToViewWithMetadata } from "../utils";
import { createTopicForSlackUsers } from "./createTopicForSlackUsers";
import { tryOpenRequestModal } from "./tryOpenRequestModal";

const SLASH_COMMAND = "/" + process.env.SLACK_SLASH_COMMAND;
const SHORTCUT = { callback_id: "global_acapela", type: "shortcut" } as const as GlobalShortcut;
const MESSAGE_ACTION = { callback_id: "message_acapela", type: "message_action" } as const as MessageShortcut;

const hourToOption = (hour: number) => Bits.Option({ value: `${hour}`, text: format(new Date(0, 0, 0, hour), "h a") });

export function setupRequestModal(app: App) {
  app.command(SLASH_COMMAND, async ({ command, ack, context, body }) => {
    const { trigger_id: triggerId, channel_id: channelId, user_id: slackUserId, team_id: slackTeamId } = command;

    if (body.text.toLowerCase() == "help") {
      await ack({
        response_type: "ephemeral",
        text: [
          `To create a request type ${Md.codeInline("/acapela")} with the text for the initial message.`,
          "You can also @-tag people that should receive the request.",
          `For example:\n${Md.codeBlock(`/acapela can you forward the documentation to me, ${Md.user(slackUserId)}?`)}`,
        ].join(" "),
      });
      return;
    }

    await ack();

    const { user } = await tryOpenRequestModal(assertToken(context), triggerId, {
      channelId,
      slackUserId,
      slackTeamId,
      origin: "slack-command",
      messageText: body.text,
    });

    if (user) {
      trackBackendUserEvent(user.id, "Used Slack Slash Command", {
        slackUserName: command.user_name,
        commandName: SLASH_COMMAND,
      });
    }
  });

  app.shortcut(SHORTCUT, async ({ shortcut, ack, body, context }) => {
    await ack();

    const { user } = await tryOpenRequestModal(assertToken(context), shortcut.trigger_id, {
      slackUserId: body.user.id,
      slackTeamId: assertDefined(body.team?.id, "must have slack team"),
      origin: "slack-shortcut",
    });

    if (user) {
      trackBackendUserEvent(user.id, "Used Slack Global Shortcut", { slackUserName: body.user.username });
    }
  });

  app.shortcut(MESSAGE_ACTION, async ({ shortcut, ack, body, context }) => {
    await ack();

    const { channel, message, trigger_id } = shortcut;
    const { user } = await tryOpenRequestModal(assertToken(context), trigger_id, {
      channelId: channel.id,
      messageTs: message.ts,
      slackUserId: body.user.id,
      slackTeamId: assertDefined(body.team?.id, "must have slack team"),
      messageText: message.text || "",
      origin: "slack-message-action",
    });

    if (user) {
      trackBackendUserEvent(user.id, "Used Slack Message Action", { slackUserName: body.user.name });
    }
  });

  listenToViewWithMetadata(app, "open_request_modal", async ({ ack, context, body, metadata }) => {
    await ack();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await tryOpenRequestModal(assertToken(context), (body as any).trigger_id, metadata);
  });

  listenToViewWithMetadata<ViewSubmitAction>(app, "create_request", async (args) => {
    const { ack, view, body, client, context, metadata } = args;
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

    const ownerSlackUserId = body.user.id;

    const [team, owner] = await Promise.all([
      db.team.findFirst({ where: { team_slack_installation: { slack_team_id: slackTeamId } } }),
      findUserBySlackId(token, ownerSlackUserId),
    ]);

    assert(team, "must have a team");
    assert(owner, "must have a user");

    const slackUserIdsWithMentionType: { slackUserId: string; mentionType?: MentionType }[] = members.map((id) => ({
      slackUserId: id,
      mentionType: requestType.value as MentionType,
    }));

    const channelId = metadata.channelId ?? view.state.values.channel_block.channel_select.selected_channel;

    await ack({ response_action: "clear" });

    const topic = await createTopicForSlackUsers({
      token,
      teamId: team.id,
      ownerId: owner.id,
      ownerSlackUserId,
      slackTeamId,
      rawTopicMessage: messageText,
      topicName,
      slackUserIdsWithMentionType,
    });

    if (!channelId) {
      const topicURL = process.env.FRONTEND_URL + routes.topic({ topicSlug: topic.slug });
      await client.views.open({
        trigger_id: body.trigger_id,
        view: Modal({ title: "Request created" })
          .blocks(
            Blocks.Section({ text: `You can find your request in you sidebar or behind this link:\n${topicURL}` })
          )
          .buildToObject(),
      });
      return;
    }

    const response = await client.chat.postMessage({
      ...(await LiveTopicMessage(topic, { isMessageContentExcluded: true })),
      token,
      channel: channelId,
      thread_ts: metadata.messageTs,
    });

    if (!response.ok) {
      assert(response.error, "non-ok response without an error");
      Sentry.captureException(response.error);
      return;
    }

    await client.chat.postEphemeral({
      token,
      channel: channelId,
      thread_ts: metadata.messageTs,
      user: ownerSlackUserId,
      blocks: Message()
        .blocks(
          Blocks.Section({ text: "Add a due date to let your team know by when you need them to get back to you." }),
          Blocks.Input({ blockId: "due_at_date_block", label: "Date" }).element(
            Elements.DatePicker({ actionId: "due_at_date" }).initialDate(getNextWorkDayEndOfDay())
          ),
          Blocks.Input({ blockId: "due_at_hour_block", label: "Time" }).element(
            Elements.StaticSelect({ actionId: "due_at_hour" })
              .options([...Array(24).keys()].map((hour) => hourToOption(hour)))
              .initialOption(hourToOption(12))
          ),
          Blocks.Actions().elements(
            Elements.Button({
              actionId: SlackActionIds.UpdateMessageTaskDueAt,
              text: "Set Due Date",
              value: topic.message[0].id,
            }).primary(true)
          )
        )
        .buildToObject().blocks,
    });

    const { channel, message } = response;
    assert(channel && message?.ts, "ok response without channel or message_ts");
    await db.topic_slack_message.create({
      data: { topic_id: topic.id, slack_channel_id: channel, slack_message_ts: message.ts, is_excluding_content: true },
    });

    if (owner) {
      trackBackendUserEvent(owner.id, "Created Request", {
        origin: metadata.origin,
        topicName: topic.name,
      });
    }
  });
}
