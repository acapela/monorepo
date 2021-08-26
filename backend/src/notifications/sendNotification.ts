import { SlackInstallation, slackClient } from "~backend/src/slack/app";
import { TeamMember, User, db } from "~db";
import { assert } from "~shared/assert";
import { DEFAULT_NOTIFICATION_EMAIL, sendEmail } from "~shared/email";

async function trySendSlackNotification(teamId: string, email: string, text: string) {
  const slackInstallation = await db.team_slack_installation.findUnique({ where: { team_id: teamId } });
  if (!slackInstallation) {
    return;
  }
  const botToken = (slackInstallation.data as unknown as SlackInstallation)?.bot?.token;
  if (!botToken) {
    return;
  }
  const { user: slackUser } = await slackClient.users.lookupByEmail({ token: botToken, email });
  if (!slackUser || !slackUser.id) {
    return;
  }
  await slackClient.chat.postMessage({ token: botToken, channel: slackUser.id, text });
}

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
    teamMember.notify_slack ? trySendSlackNotification(team_id, email, content) : undefined,
    teamMember.notify_email
      ? sendEmail({
          from: DEFAULT_NOTIFICATION_EMAIL,
          subject,
          to: email,
          html: content.split("\n").join("<br>"),
        })
      : undefined,
  ]);
};
