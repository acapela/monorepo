import { HasuraEvent } from "~backend/src/hasura";
import { fetchTeamBotToken } from "~backend/src/slack/utils";
import { TaskSlackMessage, db } from "~db";
import { assert, assertDefined } from "~shared/assert";

import { slackClient } from "./app";

export async function handleTaskSlackMessageChanges(event: HasuraEvent<TaskSlackMessage>) {
  if (event.type == "delete") {
    const { topic_id, slack_channel_id: channel, slack_message_ts: ts } = event.item;
    const topic = await db.topic.findUnique({ where: { id: topic_id } });
    assert(topic, "missing topic");
    const token = assertDefined(await fetchTeamBotToken(topic.team_id), "missing token");
    await slackClient.chat.delete({ token, channel, ts });
  }
}
