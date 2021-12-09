import { compact, uniq } from "lodash";

import { slackClient } from "../app";

export function pickSlackUserIdsFromMessageText(messageText: string) {
  return uniq(Array.from(messageText.matchAll(/<@([^|>]+)(\|([^>]*))?>/gm)).map(({ 1: slackUserId }) => slackUserId));
}

export async function excludeBotUsers(token: string, userIds: string[]): Promise<string[]> {
  return compact(
    (
      await Promise.all(
        userIds.map((userId) =>
          slackClient.users.info({
            token,
            user: userId,
          })
        )
      )
    ).map((res) => res.ok && !res.user?.is_bot && res.user?.id)
  );
}

export async function pickRealUsersFromMessageText(token: string, messageText?: string) {
  const slackUserIdsFromMessage = await excludeBotUsers(
    token,
    messageText ? pickSlackUserIdsFromMessageText(messageText) : []
  );

  return slackUserIdsFromMessage;
}
