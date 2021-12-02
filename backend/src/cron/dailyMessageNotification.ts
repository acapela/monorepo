import { get, map, uniq } from "lodash";

import { slackClient } from "~backend/src/slack/app";
import { db } from "~db";

export async function dailyMessageNotification() {
  const currentUtcHour = new Date().getUTCHours();
  // get all users that currently have the first working hour
  const teamMembers = await db.team_member.findMany({
    where: {
      work_start_hour_in_utc: currentUtcHour,
    },
    include: {
      team_member_slack: true,
    },
  });

  const slackInstallations = await db.team_slack_installation.findMany({
    where: {
      team_id: {
        in: uniq(map(teamMembers, "team_id")),
      },
    },
  });

  const slackBotTokenByTeamId = Object.assign(
    {},
    ...slackInstallations.map((si) => ({ [si.team_id]: get(si.data, "bot.token") }))
  );

  for (const teamMember of teamMembers) {
    const token = slackBotTokenByTeamId[teamMember.team_id];
    const slackUserId = get(teamMember.team_member_slack, "slack_user_id");
    if (!token || !slackUserId) continue;
    await slackClient.chat.postMessage({
      token,
      channel: slackUserId,
      text: "Good morning :sunny:",
    });
  }
}
