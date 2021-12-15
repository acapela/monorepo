import { assert } from "~shared/assert";
import { typedKeys } from "~shared/object";
import { removePrefix } from "~shared/text/substring";
import { RequestType } from "~shared/types/mention";
import { createTypeGuard } from "~shared/typeUtils/typeGuard";

import { assertToken } from "../utils";
import { createAndTrackRequestInSlack } from "./createRequestInSlack";
import { SlashCommandRequest } from "./types";
import { pickRealUsersFromMessageText } from "./utils";

const quickEntryAliases = createTypeGuard<Record<string, RequestType>>()({
  reply: "request-response",
  respond: "request-response",
  response: "request-response",
  action: "request-action",
  todo: "request-action",
  read: "request-read",
  decide: "request-decision",
  decision: "request-decision",
});

export function getQuickEntryAliasFromMessageBody(body: string) {
  const preparedBody = body.toLowerCase().trim();

  for (const possibleAlias of typedKeys(quickEntryAliases)) {
    if (preparedBody.startsWith(possibleAlias)) {
      return possibleAlias;
    }
  }

  return null;
}

export function getQuickEntryCommandFromMessageBody(body: string) {
  const commandAlias = getQuickEntryAliasFromMessageBody(body);

  if (!commandAlias) return null;

  return quickEntryAliases[commandAlias];
}

function removeQuickEntryAliasFromMessageBody(body: string) {
  const commandAlias = getQuickEntryAliasFromMessageBody(body);

  if (!commandAlias) return body;

  return removePrefix(body, commandAlias);
}

export async function handleSlackCommandAsQuickEntry(request: SlashCommandRequest) {
  const { user_id: slackUserId, team_id: slackTeamId } = request.command;
  //
  const {
    payload: { trigger_id: triggerId, channel_id: channelId },
    client,
    context: { botToken },
  } = request;

  const token = assertToken(request.context);

  const messageBody = request.body.text;

  const requestType = getQuickEntryCommandFromMessageBody(messageBody);

  assert(requestType, "Cannot handle quick entry if message does not start with request type");

  /**
   * For /acapela action Please reply @adam:
   *
   * assume content to be "Please reply @adam", not "action Please reply @adam"
   */
  const messageBodyWithoutCommandAlias = removeQuickEntryAliasFromMessageBody(messageBody);

  const mentionedPeopleSlackIds = await pickRealUsersFromMessageText(token, messageBodyWithoutCommandAlias);

  if (mentionedPeopleSlackIds.length === 0) {
    // In case no one is mentioned - assume self request
    mentionedPeopleSlackIds.push(slackUserId);
  }

  await createAndTrackRequestInSlack({
    messageText: messageBodyWithoutCommandAlias,
    slackTeamId: slackTeamId,
    creatorSlackUserId: slackUserId,
    requestType,
    requestForSlackUserIds: mentionedPeopleSlackIds,
    origin: "slack-command",
    token,
    originalChannelId: channelId,
    conversationId: channelId,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore WebClient has different version of typings and is not directly exported from slack-bolt
    client,
    triggerId,
    botToken,
  });
}
