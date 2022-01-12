import { get, map, uniq } from "lodash";

import { db } from "@aca/db";
import { logger } from "@aca/shared/logger";
import { Sentry } from "@aca/shared/sentry";

import { trySendDailySummary } from "../slack/daily-summary";
import { TeamMemberWithSlack } from "../slack/daily-summary/types";

/*
The daily notification message is composed of multiple parts that work together to craft this message.

1. Users' timezone and work hours

By default, the users timezone and work hours are set automatically whenever the user visits the site.
This happens whenever the users creates and account or just visits the acapela webapp.

We'll take the timezone from the browser and the default work hours will be 9-6pm (MON-FRI). The work hours are stored
as the equivalent UTC hour (e.g. instead of 11AM In Berlin -> we'll store 10AM UTC)

Users can modify their timezone, work hours in the settings page.

12-2021: At this point, all users are treated as to be working Mon-Fri. No other flexible options
have been included yet.

2. Slack Notification Queue

Whenever a notification is sent to the user outside of their work hours, the notification won't be delivered. Instead,
we'll grab that notification and place it in a slack_notification_queue (👀 sendNotification). These notifications will
part of the Daily Summary Message. 

If users still haven't setup their work hours, then the notification will go through normally.

3. Daily Message Notification Cron Job

This cron job will work every hour from MON-FRI. It will send a daily summary on the user's work start hour, and will 
clear up the notification queue for the user.

12-2021: At this point, this code is not made to scale and is very slow. It needs to be examined once we have 1k active 
users.
*/
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
