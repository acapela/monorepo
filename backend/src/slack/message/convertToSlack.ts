import { Message, db } from "@aca/db";
import { RichEditorNode } from "@aca/richEditor/content/types";
import { isNotNullish } from "@aca/shared/nullish";

import { GenerateContext, SlackMentionContext, generateMarkdownFromTipTapJson } from "../md/generator";

/**
 * To prepare slack markdown from message, we need map of our user id <> slack user id.
 *
 * This function prepares such map for any message
 */
async function createSlackUsersContextForMessage(messageId: string): Promise<GenerateContext | null> {
  // Get message, doing joins all the way to team member slack info.
  const mentionsInfo = await db.message.findFirst({
    where: { id: messageId },
    include: {
      topic: {
        include: {
          team: {
            include: {
              team_member: {
                include: {
                  user: true,
                  team_member_slack: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!mentionsInfo) return null;

  const userIdToSlackIdEntries = mentionsInfo.topic.team.team_member
    .map((member): [userId: string, context: SlackMentionContext] => {
      const userId = member.user_id;
      const slackUserId = member.team_member_slack?.slack_user_id;

      if (!slackUserId) {
        return [userId, { name: member.user.name }];
      }

      return [userId, { slackId: slackUserId }];
    })
    .filter(isNotNullish);

  const mentionedSlackIdByUsersId = Object.fromEntries(userIdToSlackIdEntries);

  return {
    mentionedSlackIdByUsersId,
  };
}

export async function convertDbMessageToSlackMessage(message: Message) {
  const slackMentionsContext = await createSlackUsersContextForMessage(message.id);

  return generateMarkdownFromTipTapJson(message.content as RichEditorNode, { ...slackMentionsContext });
}

export async function convertDbMessageToSlackMessageSnippet(message: Message) {
  const slackMentionsContext = await createSlackUsersContextForMessage(message.id);

  return generateMarkdownFromTipTapJson(message.content as RichEditorNode, {
    ...slackMentionsContext,
    rootNodesLimit: 1,
  });
}
