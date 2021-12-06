import { KnownBlock } from "@slack/bolt";
import { SlackBlockDto } from "slack-block-builder";

import { User, db } from "~db";

import { fetchTeamBotToken } from "../slack/utils";
import { SlackPayload } from "./sendNotification";

export async function enqueueSlackNotification(teamId: string, user: User, payload: SlackPayload) {
  const [token, teamMemberSlack] = await Promise.all([
    fetchTeamBotToken(teamId),
    await db.team_member_slack.findFirst({
      where: { team_member: { team_id: teamId, user_id: user.id } },
    }),
  ]);

  if (!token || !teamMemberSlack) {
    return undefined;
  }

  payload = typeof payload == "function" ? await payload() : payload;

  const textOrBlocks = typeof payload === "string" ? { text: payload } : { blocks: extractText(payload) };

  await db.slack_notification_queue.create({
    data: {
      team_member_slack_id: teamMemberSlack?.id,
      payload: JSON.stringify(textOrBlocks),
    },
  });
}

function extractText(blocks: KnownBlock[] | SlackBlockDto[]) {
  const result: KnownBlock[] = [];

  blocks.forEach((block) => {
    if (block.type === "section") {
      // SlackBlockDto is heavily duck-typed. We need to make runtime assertions to make TS happy
      const block_id = "block_id" in block ? block.block_id : undefined;
      const text = "text" in block ? block.text : undefined;
      const fields = "fields" in block ? block.fields : undefined;
      result.push({
        block_id,
        type: block.type,
        text,
        fields,
      });
    }
  });

  return result;
}
