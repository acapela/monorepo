import { App, Context, Middleware, SlackViewAction, SlackViewMiddlewareArgs, ViewOutput } from "@slack/bolt";
import { WebClient } from "@slack/web-api";
import { zonedTimeToUtc } from "date-fns-tz";
import { upperFirst } from "lodash";
import { Md } from "slack-block-builder";

import { User, db } from "~db";
import { assert, assertDefined } from "~shared/assert";
import { getNextWorkDayEndOfDay } from "~shared/dates/times";
import { checkHasAllSlackBotScopes } from "~shared/slack";
import { Maybe } from "~shared/types";
import { AnalyticsEventsMap, Origin } from "~shared/types/analytics";
import { REQUEST_ACTION, REQUEST_DECISION, REQUEST_READ, REQUEST_RESPONSE, RequestType } from "~shared/types/mention";

import { SlackInstallation, slackClient } from "./app";
import { isWebAPIErrorType } from "./errors";

export const extractInstallationDataBotToken = (data: unknown) => (data as SlackInstallation)?.bot?.token;

export async function fetchTeamBotToken(teamId: string) {
  const slackInstallation = await db.team_slack_installation.findUnique({ where: { team_id: teamId } });
  return slackInstallation ? extractInstallationDataBotToken(slackInstallation.data) : null;
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

export async function fetchTeamMemberToken(userId: string, teamId: string) {
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
  if (!profile?.email) {
    return;
  }
  return await db.user.findFirst({ where: { team_member: { some: { team_id: teamId } }, email: profile.email } });
}

export async function getSlackUserMentionOrLabel(user: User, teamId: string) {
  const invitingUserSlackId = await findSlackUserId(teamId, user);
  return invitingUserSlackId ? `<@${invitingUserSlackId}>` : user.name;
}

export const SlackActionIds = {
  CreateTopic: "create-topic",
  ReOpenTopic: "reopen-topic",
  CloseTopic: "close-topic",
  ArchiveTopic: "archive-topic",
  TrackEvent: "track-event",
  OpenViewRequestModal: "open_view_request_modal",
  PostSelfRequestInChannel: "post-self-request-in-channel",
} as const;

export type CreateRequestOrigin = AnalyticsEventsMap["Created Request"]["origin"];

export type ChannelInfo = {
  members: string[];
  isPrivate: boolean;
} | null;

export type ViewMetadata = {
  open_create_request_modal: {
    slackUserId: string;
    slackTeamId: string;
    origin: CreateRequestOrigin;
    channelId?: string;
    messageTs?: string;
    messageText?: string;
    fromMessageBelongingToSlackUserId?: string;
  };
  create_request: {
    requestToSlackUserIds?: string[];
    messageText?: string;
    channelId?: string;
    channelInfo?: ChannelInfo;
    messageTs?: string;
    origin: CreateRequestOrigin;
    fromMessageBelongingToSlackUserId?: string;
    slackUserIdsFromMessage?: string[];
  };
  open_view_request_modal: {
    slackUserId: string;
    slackTeamId: string;
    topicId: string;
  };
  view_request_modal: {
    topicId: string;
    slackUserId: string;
  };
};

export const attachToViewWithMetadata = <Key extends keyof ViewMetadata>(
  callbackId: Key,
  metadata: ViewMetadata[Key]
) => ({
  callbackId,
  privateMetaData: JSON.stringify(metadata),
});

export function listenToViewWithMetadata<
  ViewActionType extends SlackViewAction = SlackViewAction,
  Key extends keyof ViewMetadata = keyof ViewMetadata
>(app: App, key: Key, listener: Middleware<SlackViewMiddlewareArgs<ViewActionType> & { metadata: ViewMetadata[Key] }>) {
  app.view<ViewActionType>(key, (data) => listener({ ...data, metadata: JSON.parse(data.view.private_metadata) }));
}

export const REQUEST_TYPE_EMOJIS: Record<RequestType, string> = {
  [REQUEST_ACTION]: "🎬",
  [REQUEST_RESPONSE]: "📝",
  [REQUEST_DECISION]: "🤔",
  [REQUEST_READ]: "👀",
};

export async function createTeamMemberUserFromSlack(token: string, slackUserId: string, teamId: string) {
  const { profile } = await slackClient.users.profile.get({ token, user: slackUserId });
  assert(profile, `missing profile for slack user ${slackUserId}`);
  const email = assertDefined(profile.email, `missing email for slack user ${slackUserId}`);
  return db.team_member.create({
    data: {
      user: {
        connectOrCreate: {
          where: { email },
          create: {
            email,
            name: assertDefined(profile.display_name, `missing display name for slack user ${slackUserId}`),
            avatar_url: profile.image_original,
            current_team_id: teamId,
          },
        },
      },
      team: { connect: { id: teamId } },
    },
    include: {
      user: { include: { account: true } },
    },
  });
}

export const checkHasSlackInstallationAllBotScopes = (data: unknown) =>
  checkHasAllSlackBotScopes((data as SlackInstallation)?.bot?.scopes ?? []);

export async function buildDateTimePerUserTimezone(
  client: WebClient,
  slackUserId: string,
  maybeDate: Maybe<string>,
  maybeHour: Maybe<string>
) {
  const { user: slackUser } = await client.users.info({ user: slackUserId });
  const date = maybeDate ?? getNextWorkDayEndOfDay().toISOString().split("T")[0];
  const hour = maybeHour ?? "12";
  const timeZone = slackUser?.tz ?? "Europe/Berlin";
  return zonedTimeToUtc(`${date} ${hour}:00`, timeZone);
}

export const PriorityLabel = (priority: null | string) =>
  priority ? `🚩 ${Md.bold("Priority")} ${upperFirst(priority)}` : undefined;

type SlackViewOrigin = Extract<
  Origin,
  "slack-live-message" | "slack-home-tab" | "slack-view-request-modal" | "unknown"
>;

export function getViewOrigin(view?: ViewOutput): SlackViewOrigin {
  if (!view) {
    return "slack-live-message";
  }

  if (view.type === "home") {
    return "slack-home-tab";
  }
  if (view.type === "modal" && view.callback_id === "view_request_modal") {
    return "slack-view-request-modal";
  }

  return "unknown";
}
