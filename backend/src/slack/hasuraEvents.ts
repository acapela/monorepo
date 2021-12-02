import { HasuraEvent } from "~backend/src/hasura";
import { extractInstallationDataBotToken, fetchTeamBotToken } from "~backend/src/slack/utils";
import { TaskSlackMessage, TeamSlackInstallation, db } from "~db";
import { assert, assertDefined } from "~shared/assert";

import { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, slackClient } from "./app";

export async function handleTaskSlackMessageChanges(event: HasuraEvent<TaskSlackMessage>) {
  if (event.type == "delete") {
    const { topic_id, slack_channel_id: channel, slack_message_ts: ts } = event.item;
    const topic = await db.topic.findUnique({ where: { id: topic_id } });
    assert(topic, `missing topic ${topic_id}`);
    const teamId = topic.team_id;
    const token = assertDefined(await fetchTeamBotToken(teamId), `missing token for team ${teamId}`);
    await slackClient.chat.delete({ token, channel, ts });
  }
}

export async function handleTeamSlackInstallationUpdates(event: HasuraEvent<TeamSlackInstallation>) {
  if (event.type !== "delete") {
    return;
  }
  await db.team_member_slack.deleteMany({ where: { team_member: { team_id: event.item.team_id } } });
  const botToken = extractInstallationDataBotToken(event.item.data);
  assert(botToken, "must have bot token");
  await slackClient.apps.uninstall({
    token: botToken,
    client_id: SLACK_CLIENT_ID,
    client_secret: SLACK_CLIENT_SECRET,
  });
}
