import { db } from "~db";
import { assert } from "~shared/assert";
import { typedKeys } from "~shared/object";
import { RequestType } from "~shared/types/mention";
import { createTypeGuard } from "~shared/typeUtils/typeGuard";

import { findUserBySlackId } from "../utils";
import { createRequestInSlack } from "./createRequestInSlack";
import { SlashCommandRequest } from "./types";
import { pickOtherRealUsersFromMessageText } from "./utils";

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

export function getQuickEntryCommandFromMessageBody(body: string) {
  const preparedBody = body.toLowerCase().trim();

  for (const possibleAlias of typedKeys(quickEntryAliases)) {
    if (preparedBody.startsWith(possibleAlias)) {
      return quickEntryAliases[possibleAlias];
    }
  }

  return null;
}

export async function handleSlackCommandAsQuickEntry(request: SlashCommandRequest) {
  const { user_id: slackUserId, team_id: slackTeamId } = request.command;

  const {
    payload: { token, trigger_id: triggerId, channel_id: channelId },
    client,
    context: { botToken },
  } = request;

  const messageBody = request.body.text;

  const requestType = getQuickEntryCommandFromMessageBody(messageBody);

  assert(requestType, "Cannot handle quick entry if message does not start with request type");

  const mentionedPeopleSlackIds = await pickOtherRealUsersFromMessageText(token, slackUserId, request.body.text);

  const [owner, team] = await Promise.all([
    findUserBySlackId(token, slackUserId),
    db.team.findFirst({
      where: { team_slack_installation: { slack_team_id: slackTeamId } },
      include: { team_slack_installation: true },
    }),
  ]);

  assert(team, "No team");
  assert(owner, "No owner");

  await createRequestInSlack({
    messageText: messageBody,
    slackTeamId: slackTeamId,
    creatorSlackUserId: slackUserId,
    requestType,
    requestForSlackUserIds: mentionedPeopleSlackIds,
    origin: "slack-command",
    token,
    channelId,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore WebClient has different version of typings and is not directly exported from slack-bolt
    client,
    triggerId,
    botToken,
  });
}
