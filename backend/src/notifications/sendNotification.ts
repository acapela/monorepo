import * as Sentry from "@sentry/node";
import { Block, KnownBlock } from "@slack/bolt";
import { ChatPostMessageResponse } from "@slack/web-api";
import { pick } from "lodash";

import { slackClient } from "~backend/src/slack/app";
import { fetchTeamBotToken, findSlackUserId } from "~backend/src/slack/utils";
import { User, db } from "~db";
import { assertDefined } from "~shared/assert";
import { EmailData, sendEmail } from "~shared/email";

type SlackMessage = string | (KnownBlock | Block)[];
type SlackPayload = SlackMessage | (() => Promise<SlackMessage>);

async function trySendSlackNotification(teamId: string, user: User, payload: SlackPayload) {
  const [token, slackUserId] = await Promise.all([fetchTeamBotToken(teamId), findSlackUserId(teamId, user)]);
  if (!token || !slackUserId) {
    return undefined;
  }

  payload = typeof payload == "function" ? await payload() : payload;
  const textOrBlocks = typeof payload === "string" ? { text: payload } : { blocks: payload };
  return slackClient.chat.postMessage({
    token,
    channel: slackUserId,
    ...textOrBlocks,
  });
}

export type NotificationMessage = { slack: SlackPayload; email: EmailData };

async function sendNotification(
  user: User,
  teamId: string,
  message: Partial<NotificationMessage>
): Promise<{ slackMessage?: ChatPostMessageResponse }> {
  try {
    const [slackMessage] = await Promise.all([
      message.slack ? trySendSlackNotification(teamId, user, message.slack) : undefined,
      message.email ? sendEmail(message.email, user.email) : undefined,
    ]);
    return slackMessage?.ok ? { slackMessage } : {};
  } catch (error) {
    Sentry.captureException(error);
    console.error(error);
    return {};
  }
}

export async function sendNotificationIgnoringPreference(
  user: User,
  teamId: string,
  message: Partial<NotificationMessage>
) {
  return sendNotification(user, teamId, message);
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
