import { slackClient } from "~backend/src/slack/app";
import { fetchTeamBotToken, findSlackUserId } from "~backend/src/slack/utils";
import { TeamMember, User, db } from "~db";
import { assert, assertDefined } from "~shared/assert";
import { DEFAULT_NOTIFICATION_EMAIL, sendEmail } from "~shared/email";
import { Sentry } from "~shared/sentry";

async function trySendSlackNotification(teamId: string, user: User, text: string) {
  const [token, slackUserId] = await Promise.all([fetchTeamBotToken(teamId), findSlackUserId(teamId, user)]);
  if (!token || !slackUserId) {
    return;
  }
  await slackClient.chat.postMessage({ token, channel: slackUserId, text });
}

/*
  NOTE: Don't await in crucial business logic flows.
  This method interacts with 3rd party providers over network.
  There's a higher risk of timeout and errors present.
*/
export async function sendNotificationPerPreference(
  user: User,
  teamId: string,
  message: {
    email: {
      subject: string;
      html: string;
    };
    slack: string;
  }
): Promise<unknown> {
  const teamMember = assertDefined(
    await db.team_member.findFirst({ where: { user_id: user.id, team_id: teamId } }),
    "missing team_member"
  );
  return Promise.all([
    teamMember.notify_slack ? trySendSlackNotification(teamId, user, message.slack) : undefined,
    teamMember.notify_email
      ? sendEmail({
          from: DEFAULT_NOTIFICATION_EMAIL,
          subject: message.email.subject,
          to: user.email,
          html: message.email.html.split("\n").join("<br>"),
        })
      : undefined,
  ]).catch((error) => Sentry.captureException(error));
}
