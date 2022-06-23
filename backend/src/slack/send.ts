import { Team } from "@slack/web-api/dist/response/TeamInfoResponse";

import { getPermalink, getSlackInstallationData } from "@aca/backend/src/slack/utils";
import { db } from "@aca/db";
import { SendMessageInput } from "@aca/gql";
import { assert } from "@aca/shared/assert";

import { slackClient } from "./app";

export async function sendSlackMessage(userId: string, msg: SendMessageInput) {
  const [team, channel] = msg.to.split("/");
  assert(team, "team is missing");
  assert(channel, "channel is missing");
  const slackInstallation = await db.user_slack_installation.findFirst({
    where: { user_id: userId, slack_team_id: team },
    include: {
      slack_team: true,
    },
  });

  assert(slackInstallation, "user has no slack installation");
  const slackInstallationData = getSlackInstallationData(slackInstallation);

  const res = await slackClient.chat.postMessage({
    token: slackInstallationData.user.token,
    channel,
    text: msg.message,
  });

  return getPermalink({
    url: (slackInstallation.slack_team.team_info_data as Team).url,
    team,
    channel,
    messageTs: res.message!.ts!,
    threadTs: res.message?.thread_ts,
  });
}
