import * as Sentry from "@sentry/node";
import { pick } from "lodash";

import { slackClient } from "~backend/src/slack/app";
import { fetchTeamBotToken, findSlackUserId } from "~backend/src/slack/utils";
import { User, db } from "~db";
import { assertDefined } from "~shared/assert";
import { DEFAULT_NOTIFICATION_EMAIL, sendEmail } from "~shared/email";

async function trySendSlackNotification(teamId: string, user: User, text: string) {
  const [token, slackUserId] = await Promise.all([fetchTeamBotToken(teamId), findSlackUserId(teamId, user)]);
  if (!token || !slackUserId) {
    return;
  }
  await slackClient.chat.postMessage({ token, channel: slackUserId, text });
}

type NotificationMessage = {
  email: {
    subject: string;
    html: string;
  };
  slack: string;
};

/*
  NOTE: Don't await in crucial business logic flows.
  This method interacts with 3rd party providers over network.
  There's a higher risk of timeout and errors present.
*/
const sendNotification = async (user: User, teamId: string, message: Partial<NotificationMessage>): Promise<unknown> =>
  Promise.all([
    message.slack ? trySendSlackNotification(teamId, user, message.slack) : undefined,
    message.email
      ? sendEmail({
          from: DEFAULT_NOTIFICATION_EMAIL,
          subject: message.email.subject,
          to: user.email,
          html: message.email.html.split("\n").join("<br>"),
        })
      : undefined,
  ]).catch((error) => Sentry.captureException(error));

export async function sendNotificationIgnoringPreference(user: User, teamId: string, message: NotificationMessage) {
  return sendNotification(user, teamId, message);
}

export async function sendNotificationPerPreference(user: User, teamId: string, message: NotificationMessage) {
  const teamMember = assertDefined(
    await db.team_member.findFirst({ where: { user_id: user.id, team_id: teamId } }),
    "missing team_member"
  );
  return sendNotification(
    user,
    teamId,
    pick(message, ...(teamMember.notify_email ? ["email"] : []), ...(teamMember.notify_slack ? ["slack"] : []))
  );
}
