import { App, Context, Middleware, SlackViewAction, SlackViewMiddlewareArgs } from "@slack/bolt";

import { User, db } from "~db";
import { assertDefined } from "~shared/assert";
import { AnalyticsEventsMap } from "~shared/types/analytics";

import { SlackInstallation, slackClient } from "./app";
import { isWebAPIErrorType } from "./errors";

export async function fetchTeamBotToken(teamId: string) {
  const slackInstallation = await db.team_slack_installation.findUnique({ where: { team_id: teamId } });
  if (!slackInstallation) {
    return;
  }
  return (slackInstallation.data as unknown as SlackInstallation)?.bot?.token;
}

export const assertToken = (c: Context) => assertDefined(c.userToken ?? c.botToken, "must have at least one token");

// finds a slack user either through the team_member's slack installation or by email
export async function findSlackUserId(teamId: string, user: User): Promise<string | undefined> {
  const teamMemberSlack = await db.team_member_slack.findFirst({
    where: { team_member: { team_id: teamId, user_id: user.id } },
  });
  if (teamMemberSlack) {
    return teamMemberSlack.slack_user_id;
  }

  const token = await fetchTeamBotToken(teamId);
  if (!token) {
    return;
  }
  try {
    const { user: slackUser } = await slackClient.users.lookupByEmail({ token, email: user.email });
    return slackUser?.id;
  } catch (error) {
    if (!isWebAPIErrorType(error, "users_not_found")) {
      throw error;
    }
  }
}

export async function fetchTeamMemberBotToken(userId: string, teamId: string) {
  const teamMemberSlack = await db.team_member_slack.findFirst({
    where: { team_member: { team_id: teamId, user_id: userId } },
  });
  return (teamMemberSlack?.installation_data as unknown as SlackInstallation["user"])?.token;
}

export async function findUserBySlackId(token: string, slackUserId: string, teamId?: string) {
  const user = await db.user.findFirst({
    where: { team_member: { some: { team_id: teamId, team_member_slack: { slack_user_id: slackUserId } } } },
  });
  if (user) {
    return user;
  }

  const { profile } = await slackClient.users.profile.get({ token, user: slackUserId });
  if (!profile) {
    return;
  }
  return await db.user.findFirst({ where: { team_member: { some: { team_id: teamId } }, email: profile.email } });
}

export async function getSlackUserMentionOrLabel(user: User, teamId: string) {
  const invitingUserSlackId = await findSlackUserId(teamId, user);
  return invitingUserSlackId ? `<@${invitingUserSlackId}>` : user.name;
}

export const SlackActionIds = {
  ReOpenTopic: "reopen-topic",
  ArchiveTopic: "archive-topic",
} as const;

export type CreateRequestOrigin = AnalyticsEventsMap["Created Topic"]["origin"];

export type ViewMetadata = {
  open_request_modal: {
    slackUserId: string;
    slackTeamId: string;
    origin: CreateRequestOrigin;
    channelId?: string;
    messageText?: string;
  };
  create_request: { messageText?: string; channelId?: string; origin: CreateRequestOrigin };
};

export const attachToViewWithMetadata = <Key extends keyof ViewMetadata>(
  callbackId: Key,
  metadata: ViewMetadata[Key]
) => ({
  callbackId,
  privateMetaData: JSON.stringify(metadata),
});

export function listenToViewWithMetadata<Key extends keyof ViewMetadata>(
  app: App,
  key: Key,
  listener: Middleware<SlackViewMiddlewareArgs<SlackViewAction> & { metadata: ViewMetadata[Key] }>
) {
  app.view(key, (data) => listener({ ...data, metadata: JSON.parse(data.view.private_metadata) }));
}
