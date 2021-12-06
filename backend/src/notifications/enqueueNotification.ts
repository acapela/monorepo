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

  const payloadAsText = typeof payload === "string" ? payload : extractText(payload);

  await db.slack_notification_queue.create({
    data: {
      team_member_slack_id: teamMemberSlack?.id,
      payload: payloadAsText,
    },
  });
}

function extractText(blocks: KnownBlock[] | SlackBlockDto[]): string {
  let result = "";

  blocks.forEach((block) => {
    if (block.type === "section") {
      // SlackBlockDto is heavily duck-typed. We need to make runtime assertions to make TS happy
      const text = "text" in block ? block.text?.text : undefined;

      if (text) {
        result += `${text}\n`;
      }
    }
  });

  return result;
}
