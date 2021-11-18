import * as Sentry from "@sentry/node";
import { Block, KnownBlock } from "@slack/bolt";
import { pick } from "lodash";

import { slackClient } from "~backend/src/slack/app";
import { fetchTeamBotToken, findSlackUserId } from "~backend/src/slack/utils";
import { User, db } from "~db";
import { assertDefined } from "~shared/assert";
import { sendEmail } from "~shared/email";

async function trySendSlackNotification(teamId: string, user: User, payload: string | (KnownBlock | Block)[]) {
  const [token, slackUserId] = await Promise.all([fetchTeamBotToken(teamId), findSlackUserId(teamId, user)]);
  if (!token || !slackUserId) {
    return;
  }

  const textOrBlocks = typeof payload === "string" ? { text: payload } : { blocks: payload };
  await slackClient.chat.postMessage({
    token,
    channel: slackUserId,
    ...textOrBlocks,
  });
}

export type NotificationMessage = {
  email: {
    subject: string;
    html: string;
  };
  template: { transactionalMessageId: number; messageData: { [key: string]: string } };
  slack: string | (KnownBlock | Block)[];
};

/*
  NOTE: Don't await in crucial business logic flows.
  This method interacts with 3rd party providers over network.
  There's a higher risk of timeout and errors present.
*/
const sendNotification = async (user: User, teamId: string, message: Partial<NotificationMessage>): Promise<unknown> =>
  Promise.all([
    message.slack ? trySendSlackNotification(teamId, user, message.slack) : undefined,
    message.email || message.template ? sendEmail(message, user.email) : undefined,
  ]).catch((error) => Sentry.captureException(error));

export async function sendNotificationIgnoringPreference(
  user: User,
  teamId: string,
  message: Partial<NotificationMessage>
) {
  return sendNotification(user, teamId, message);
}

function escapeStringForSlackLink(input: string) {
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function createSlackLink(url: string, name?: string) {
  if (!name || url === name) return `<${escapeStringForSlackLink(url)}>`;
  return `<${escapeStringForSlackLink(url)}|${escapeStringForSlackLink(name)}>`;
}

export async function sendNotificationPerPreference(user: User, teamId: string, message: Partial<NotificationMessage>) {
  const teamMember = assertDefined(
    await db.team_member.findFirst({ where: { user_id: user.id, team_id: teamId } }),
    "missing team_member"
  );
  const notificationChannels: (keyof NotificationMessage)[] = [];
  if (teamMember.notify_email) {
    notificationChannels.push("email");
  }
  if (teamMember.notify_slack) {
    notificationChannels.push("slack");
  }
  return sendNotification(user, teamId, pick(message, ...notificationChannels));
}
