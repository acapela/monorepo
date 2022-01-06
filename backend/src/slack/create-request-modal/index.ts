import {
  App,
  BlockButtonAction,
  BlockStaticSelectAction,
  GlobalShortcut,
  MessageShortcut,
  ViewSubmitAction,
} from "@slack/bolt";
import { difference, find } from "lodash";
import { Message } from "slack-block-builder";

import { DECISION_BLOCK_ID_PRE, getDecisionBlockCount } from "~backend/src/slack/create-request-modal/utils";
import { assertDefined } from "~shared/assert";
import { trackBackendUserEvent } from "~shared/backendAnalytics";
import { isNotNullish } from "~shared/nullish";
import { MentionType, REQUEST_DECISION } from "~shared/requests";

import { buildSummaryBlocksForSlackUser, missingAuthSlackBlocks } from "../home-tab/content";
import { assertToken, buildDateTimePerUserTimezone, findUserBySlackId, listenToViewWithMetadata } from "../utils";
import { createAndTrackRequestInSlack } from "./createRequestInSlack";
import { createHelpMessageForUser } from "./help";
import { handleMessageSelfRequestShortcut } from "./messageSelfRequest";
import { CreateRequestModal, openCreateRequestModal } from "./openCreateRequestModal";
import { getQuickEntryCommandFromMessageBody, handleSlackCommandAsQuickEntry } from "./quickEntry";
import { requestSlackAuthorizedOrOpenAuthModalForSlashCommand } from "./requestSlackAuthorized";

const SLASH_COMMAND = "/" + process.env.SLACK_SLASH_COMMAND;
const SHORTCUT = { callback_id: "global_acapela", type: "shortcut" } as const as GlobalShortcut;
const MESSAGE_ACTION = { callback_id: "message_acapela", type: "message_action" } as const as MessageShortcut;
const MESSAGE_SELF_REQUEST_ACTION = {
  callback_id: "quick_message_acapela",
  type: "message_action",
} as const as MessageShortcut;

export function setupCreateRequestModal(app: App) {
  app.command(SLASH_COMMAND, async (req) => {
    const { command, ack, context, body } = req;
    const { trigger_id: triggerId, channel_id: channelId, user_id: slackUserId, team_id: slackTeamId } = command;

    const possibleCommand = body.text.toLowerCase();

    if (body.text.toLowerCase() == "help") {
      const helpMessage = await createHelpMessageForUser(slackUserId);
      await ack({
        response_type: "ephemeral",
        blocks: helpMessage.buildToObject().blocks,
      });
      return;
    }

    if (["today", "t"].includes(possibleCommand)) {
      const summaryBlocks = await buildSummaryBlocksForSlackUser(slackUserId, { includeWelcome: false });

      const blocksToShow = summaryBlocks ?? missingAuthSlackBlocks;

      const blocks = Message()
        .blocks(...blocksToShow)
        .buildToObject().blocks;

      await ack({ response_type: "ephemeral", blocks });

      return;
    }

    await ack();

    const authData = await requestSlackAuthorizedOrOpenAuthModalForSlashCommand(req);

    if (!authData) {
      return;
    }

    if (getQuickEntryCommandFromMessageBody(body.text)) {
      await handleSlackCommandAsQuickEntry(req);

      return;
    }

    await openCreateRequestModal(assertToken(context), triggerId, {
      channelId,
      slackUserId,
      slackTeamId,
      origin: "slack-modal-slash-command",
      messageText: body.text,
    });

    trackBackendUserEvent(authData.user.id, "Used Slack Slash Command", {
      slackUserName: command.user_name,
      commandName: SLASH_COMMAND,
    });
  });

  app.shortcut(SHORTCUT, async ({ shortcut, ack, body, context, payload }) => {
    await ack();

    const user = await findUserBySlackId(payload.token, body.user.id);

    await openCreateRequestModal(assertToken(context), shortcut.trigger_id, {
      slackUserId: body.user.id,
      slackTeamId: assertDefined(body.team?.id, "must have slack team"),
      origin: "slack-global-shortcut",
    });

    if (user) {
      trackBackendUserEvent(user.id, "Used Slack Global Shortcut", { slackUserName: body.user.username });
    }
  });

  app.shortcut(MESSAGE_SELF_REQUEST_ACTION, async (req) => {
    await handleMessageSelfRequestShortcut(req);
  });

  app.shortcut(MESSAGE_ACTION, async ({ shortcut, ack, body, context, client, payload }) => {
    await ack();

    const { channel, message, trigger_id } = shortcut;

    const userOpeningModal = body.user.id;
    const userFromOriginalMessage = message.user;

    const slackUrl = await client.chat.getPermalink({ channel: channel.id, message_ts: message.ts });
    const messageAuthorInfo = userFromOriginalMessage
      ? await client.users.info({ user: userFromOriginalMessage })
      : null;

    const isOriginalMessageCreatedByAnotherUser =
      messageAuthorInfo?.user && userOpeningModal !== userFromOriginalMessage;

    const messageBody =
      (message.text ?? "") +
      `\n> from <${slackUrl.permalink}|slack message>` +
      (isOriginalMessageCreatedByAnotherUser ? ` by ${messageAuthorInfo.user?.real_name}` : "");

    const user = await findUserBySlackId(payload.token, body.user.id);

    await openCreateRequestModal(assertToken(context), trigger_id, {
      channelId: channel.id,
      messageTs: message.thread_ts ?? message.ts,
      slackUserId: body.user.id,
      slackTeamId: assertDefined(body.team?.id, "must have slack team"),
      messageText: messageBody,
      origin: "slack-modal-message-action",
      fromMessageBelongingToSlackUserId: isOriginalMessageCreatedByAnotherUser ? userFromOriginalMessage : undefined,
    });

    if (user) {
      trackBackendUserEvent(user.id, "Used Slack Message Action", { slackUserName: body.user.name });
    }
  });

  listenToViewWithMetadata(app, "open_create_request_modal", async ({ ack, context, body, metadata }) => {
    await ack();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await openCreateRequestModal(assertToken(context), (body as any).trigger_id, metadata);
  });

  app.action<BlockStaticSelectAction>("request_type_select", async ({ ack, client, body, context }) => {
    await ack();
    const view = assertDefined(body.view, "missing view");
    const token = assertToken(context);
    await client.views.update({
      token,
      view_id: view.id,
      view: await CreateRequestModal(token, JSON.parse(view.private_metadata), view.state.values),
    });
  });

  app.action<BlockButtonAction>("request-modal-add-option", async ({ ack, client, body, context }) => {
    await ack();
    const view = assertDefined(body.view, "missing view");
    const token = assertToken(context);
    const stateValues = view.state.values;
    const n = getDecisionBlockCount(stateValues);
    stateValues[DECISION_BLOCK_ID_PRE + n] = {
      ["decision_input_" + n]: { type: "plain_text_input", value: "" },
    };
    await client.views.update({
      token,
      view_id: view.id,
      view: await CreateRequestModal(token, JSON.parse(view.private_metadata), stateValues),
    });
  });

  listenToViewWithMetadata<ViewSubmitAction, "create_request">(app, "create_request", async (args) => {
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
      due_at_date_block: {
        due_at_date: { selected_date: dueAtDate },
      },
      due_at_hour_block: {
        due_at_hour: { selected_time: dueAtHour },
      },
      priority_block: {
        priority: { selected_option: selectedPriority },
      },
    } = view.state.values;

    const isFirstCompletionEnough = !!find(view.state.values.settings_block?.settings_checkbox?.selected_options, [
      "value",
      "first_completion_enough",
    ]);

    const token = assertToken(context);

    const messageText = metadata.messageText || view.state.values.message_block.message_text.value;

    if (!(members && requestType && messageText && members.length > 0)) {
      return await ack({
        response_action: "errors",
        errors: {
          members_block: "You need to assign at least one user.",
        },
      });
    }

    await ack({ response_action: "clear" });

    let decisionOptions: string[] = [];
    if (requestType.value === REQUEST_DECISION) {
      decisionOptions = Object.entries(view.state.values)
        .filter(([key]) => key.startsWith(DECISION_BLOCK_ID_PRE))
        .map(([, value]) => Object.values(value)[0].value)
        .filter(isNotNullish);
    }

    const observersSlackUserIds = difference(metadata.slackUserIdsFromMessage, members || []);

    await createAndTrackRequestInSlack({
      messageText,
      slackTeamId: body.user.team_id,
      creatorSlackUserId: body.user.id,
      requestType: requestType?.value as MentionType,
      requestForSlackUserIds: members,
      observersSlackUserIds,
      origin: metadata.origin,
      token,
      originalChannelId: metadata.channelId,
      conversationId:
        metadata.channelId ?? view.state.values.conversation_block.conversation_select.selected_conversation,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore WebClient has different version of typings and is not directly exported from slack-bolt
      client,
      triggerId: body.trigger_id,
      dueAt:
        dueAtDate || dueAtHour
          ? await buildDateTimePerUserTimezone(client as never, body.user.id, dueAtDate, dueAtHour)
          : null,
      messageTs: metadata.messageTs,
      botToken: context.botToken,
      topicName,
      priority: selectedPriority?.value,
      decisionOptions,
      isFirstCompletionEnough,
    });
  });
}
