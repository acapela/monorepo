import { slackClient } from "~backend/src/slack/app";
import { fetchTeamBotToken, findSlackUserId } from "~backend/src/slack/utils";
import { TeamMember, User } from "~db";
import { assert } from "~shared/assert";
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
export const sendNotificationPerPreference = (
  teamMember: TeamMember & { user: User },
  {
    subject,
    content,
  }: {
    subject: string;
    content: string;
  }
): Promise<unknown> => {
  const { user, team_id } = teamMember;
  const { email } = user;
  assert(email, "Every user should have an email");
  return Promise.all([
    teamMember.notify_slack ? trySendSlackNotification(team_id, user, content) : undefined,
    teamMember.notify_email
      ? sendEmail({
          from: DEFAULT_NOTIFICATION_EMAIL,
          subject,
          to: email,
          html: content.split("\n").join("<br>"),
        })
      : undefined,
  ]).catch((error) => Sentry.captureException(error));
};
