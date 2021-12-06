import { KnownBlock } from "@slack/bolt";
import { ChatPostMessageResponse } from "@slack/web-api";
import { pick } from "lodash";
import { SlackBlockDto } from "slack-block-builder";

import { slackClient } from "~backend/src/slack/app";
import { fetchTeamBotToken, findSlackUserId } from "~backend/src/slack/utils";
import { User, db } from "~db";
import { assert, assertDefined } from "~shared/assert";
import { EmailData, sendEmail } from "~shared/email";
import { logger } from "~shared/logger";

import { enqueueSlackNotification } from "./enqueueNotification";

export type SlackMessage = string | KnownBlock[] | SlackBlockDto[];
export type SlackPayload = SlackMessage | (() => Promise<SlackMessage>);

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

async function shouldSendNotificationDirectly(teamId: string, user: User): Promise<boolean> {
  const teamMember = await db.team_member.findFirst({
    where: {
      team_id: teamId,
      user_id: user.id,
    },
  });

  assert(teamMember, `team member for user(${user.id}) and team(${teamId}) must exist before sending notifications`);

  const { timezone, work_start_hour_in_utc, work_end_hour_in_utc } = teamMember;

  const hasSetupWorkHours = timezone && work_start_hour_in_utc && work_end_hour_in_utc;
  if (!hasSetupWorkHours) {
    return true;
  }

  const now = new Date();
  const dayOfWeek = now.getUTCDate();
  const currentUtcHour = now.getUTCHours();

  // Sun = 0, Mon, 1, ... Sat = 6
  const isNotWorkingDay = dayOfWeek >= 1 && dayOfWeek <= 5;
  if (isNotWorkingDay) {
    return false;
  }

  // e.g Start 9am - end 6pm, Start 1pm - end 10pm, etc
  if (work_start_hour_in_utc < work_end_hour_in_utc) {
    return work_start_hour_in_utc <= currentUtcHour && currentUtcHour < work_end_hour_in_utc;
  }

  // e.g Start 10pm - End 3AM, Start 5pm - end 12am, etc
  return work_start_hour_in_utc <= currentUtcHour || currentUtcHour < work_end_hour_in_utc;
}

async function sendOrEnqueueSlackNotification(teamId: string, user: User, payload: SlackPayload) {
  if (await shouldSendNotificationDirectly(teamId, user)) {
    return trySendSlackNotification(teamId, user, payload);
  }
  return await enqueueSlackNotification(teamId, user, payload);
}

export type NotificationMessage = { slack: SlackPayload; email: EmailData };

async function sendNotification(
  user: User,
  teamId: string,
  message: Partial<NotificationMessage>
): Promise<{ slackMessage?: ChatPostMessageResponse }> {
  try {
    const [slackMessage] = await Promise.all([
      message.slack ? sendOrEnqueueSlackNotification(teamId, user, message.slack) : undefined,
      message.email ? sendEmail(message.email, user.email) : undefined,
    ]);
    return slackMessage?.ok ? { slackMessage } : {};
  } catch (error) {
    logger.error(error);
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
    `missing team_member for user ${user.id} in team ${teamId}`
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
