import { App, GlobalShortcut, MessageShortcut, ViewSubmitAction } from "@slack/bolt";
import { difference } from "lodash";
import { Md } from "slack-block-builder";

import { assertDefined } from "~shared/assert";
import { trackBackendUserEvent } from "~shared/backendAnalytics";
import { MentionType } from "~shared/types/mention";

import { assertToken, findUserBySlackId, listenToViewWithMetadata } from "../utils";
import { createAndTrackRequestInSlack } from "./createRequestInSlack";
import { openCreateRequestModal } from "./openCreateRequestModal";
import { getQuickEntryCommandFromMessageBody, handleSlackCommandAsQuickEntry } from "./quickEntry";
import { requestSlackAuthorizedOrOpenAuthModal } from "./requestSlackAuthorized";

const SLASH_COMMAND = "/" + process.env.SLACK_SLASH_COMMAND;
const SHORTCUT = { callback_id: "global_acapela", type: "shortcut" } as const as GlobalShortcut;
const MESSAGE_ACTION = { callback_id: "message_acapela", type: "message_action" } as const as MessageShortcut;

export function setupCreateRequestModal(app: App) {
  app.command(SLASH_COMMAND, async (req) => {
    const { command, ack, context, body } = req;
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

    const authData = await requestSlackAuthorizedOrOpenAuthModal(req);

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
      origin: "slack-command",
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
      origin: "slack-shortcut",
    });

    if (user) {
      trackBackendUserEvent(user.id, "Used Slack Global Shortcut", { slackUserName: body.user.username });
    }
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
      origin: "slack-message-action",
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
    } = view.state.values;

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

    const observersSlackUserIds = difference(metadata.slackUserIdsFromMessage, members || []);

    createAndTrackRequestInSlack({
      messageText,
      slackTeamId: body.user.team_id,
      creatorSlackUserId: body.user.id,
      requestType: requestType?.value as MentionType,
      requestForSlackUserIds: members,
      observersSlackUserIds,
      origin: metadata.origin,
      token,
      channelId: metadata.channelId,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore WebClient has different version of typings and is not directly exported from slack-bolt
      client,
      triggerId: body.trigger_id,
      dueAtDate,
      dueAtHour,
      messageTs: metadata.messageTs,
      botToken: context.botToken,
      topicName,
    });

    await ack({ response_action: "clear" });
  });
}
