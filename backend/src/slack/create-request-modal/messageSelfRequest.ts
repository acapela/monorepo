import { trackBackendUserEvent } from "~shared/backendAnalytics";

import { assertToken } from "../utils";
import { createAndTrackRequestInSlack } from "./createRequestInSlack";
import { requestSlackAuthorizedOrOpenAuthModalForMessageShortcut } from "./requestSlackAuthorized";
import { MessageShortcutRequest } from "./types";
import { createRequestTitleFromMessageText } from "./utils";

export async function handleMessageSelfRequestShortcut(request: MessageShortcutRequest) {
  const {
    shortcut: { message, channel },
    context,
    client,
    body: {
      user: { id: slackUserId, team_id: slackTeamId, name: slackUserName },
      trigger_id: triggerId,
    },
    ack,
  } = request;

  await ack();

  const channelId = channel.id;

  const authInfo = await requestSlackAuthorizedOrOpenAuthModalForMessageShortcut(request);

  if (!authInfo) {
    return;
  }

  const token = assertToken(context);

  const messageBody = message.text;

  // TODO: Should we inform that message is empty thus no request to create? Is it even possible for message shortcut?
  if (!messageBody) return;

  // !!! We're only creating request for self, even if there are other people mentioned.
  const requestForSlackUserIds = [slackUserId];

  const messageUrl = await client.chat.getPermalink({ channel: channel.id, message_ts: message.ts });

  const messageBodyWithMessageLink = message.text + `\n\n> from <${messageUrl.permalink}|slack message>`;

  // We dont want to include 'from message' in title
  const requestTitle = createRequestTitleFromMessageText(messageBody);

  await createAndTrackRequestInSlack({
    messageText: messageBodyWithMessageLink,
    slackTeamId: slackTeamId,
    creatorSlackUserId: slackUserId,
    requestType: "request-action",
    requestForSlackUserIds: requestForSlackUserIds,
    origin: "slack-command",
    token,
    originalChannelId: channelId,
    conversationId: channelId,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore WebClient has different version of typings and is not directly exported from slack-bolt
    client,
    triggerId,
    botToken: context.botToken,
    topicName: requestTitle,
  });

  trackBackendUserEvent(authInfo.user.id, "Used Slack Self Request Message Action", { slackUserName });
}
