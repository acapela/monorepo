import { get, map, uniq } from "lodash";

import { db } from "~db";
import { logger } from "~shared/logger";
import { Sentry } from "~shared/sentry";

import { trySendDailySummary } from "../slack/daily-summary";
import { TeamMemberWithSlack } from "../slack/daily-summary/types";

// TODO: Make more efficient when we get more users!
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
    if (!teamMember.team_member_slack) {
      continue;
    }
    try {
      // Awaiting in order to slow down the API calls and not overwhelm Slack API
      // A more elegant approach should be used once we're getting to scale phase
      await trySendDailySummary(teamMember as TeamMemberWithSlack, token);
    } catch (e) {
      Sentry.captureException(e);
      logger.error(e);
    }
  }
}
