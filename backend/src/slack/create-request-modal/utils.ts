import { compact, uniq } from "lodash";

import { DEFAULT_TOPIC_TITLE_TRUNCATE_LENGTH, truncateTextWithEllipsis } from "@aca/shared/text/ellipsis";

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

export const DECISION_BLOCK_ID_PRE = "decision_block_";

export const getDecisionBlockCount = (values: object) =>
  Math.max(Object.keys(values).filter((key) => key.startsWith(DECISION_BLOCK_ID_PRE)).length, 2);

export function createRequestTitleFromMessageText(messageText: string) {
  return truncateTextWithEllipsis(messageText, DEFAULT_TOPIC_TITLE_TRUNCATE_LENGTH).replaceAll("\n", "");
}
