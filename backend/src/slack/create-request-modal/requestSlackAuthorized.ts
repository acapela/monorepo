import { Context } from "@slack/bolt";
import type { View } from "@slack/types";
import { Blocks, Modal } from "slack-block-builder";

import { getTeamSlackInstallURL, getUserSlackInstallURL } from "@aca/backend/src/slack/install";
import { Team, User, db } from "@aca/db";
import { routes } from "@aca/shared/routes";
import { checkHasAllSlackUserScopes } from "@aca/shared/slack";
import { Maybe } from "@aca/shared/types";

import { SlackInstallation, slackClient } from "../app";
import { isChannelNotFoundError } from "../errors";
import { createSlackLink } from "../md/utils";
import { assertToken, checkHasSlackInstallationAllBotScopes, findUserBySlackId } from "../utils";
import { MessageShortcutRequest, SlashCommandRequest } from "./types";

const MissingTeamModal = Modal({ title: "Four'O'Four" })
  .blocks(
    Blocks.Section({
      text: [
        "Your team's Slack is not connected with Acapela yet.",
        `Head to your team's <${process.env.FRONTEND_URL + routes.settings}|settings page> to change that.`,
      ].join(" "),
    })
  )
  .buildToObject();

const MissingUserModal = Modal({ title: "Four'O'Four" })
  .blocks(
    Blocks.Section({
      text: [
        "We could not find your user in Acapela. ",
        `This is probably a problem with our system and our engineering team has been informed. `,
      ].join(" "),
    })
  )
  .buildToObject();

const AuthRequestModal = async (token: string, slackUserId: string, teamId: string, hasAllBotScopes: boolean) => {
  const user = await findUserBySlackId(token, slackUserId, teamId);
  return Modal({
    title: "Please authorize Acapela",
    submit: "Try again",
  })
    .blocks(
      Blocks.Section({
        text: [
          "It's not you, it's us! We added some new functionality to our Acapela Slack app which requires authorizing the app.",
          "This is a normal step of the process when permissions change.",
        ].join(" "),
      }),
      Blocks.Section({
        text: `${createSlackLink(
          await (hasAllBotScopes ? getUserSlackInstallURL : getTeamSlackInstallURL)({ teamId, userId: user?.id }),
          ":arrow_right:  Link your Account (again)"
        )} to authorize it and then try again.`,
      })
    )
    .buildToObject();
};

async function checkHasTeamMemberAllSlackUserScopes(slackUserId: string) {
  const teamMemberSlack = await db.team_member_slack.findFirst({ where: { slack_user_id: slackUserId } });
  const installationData = teamMemberSlack?.installation_data as Maybe<SlackInstallation["user"]>;
  return checkHasAllSlackUserScopes(installationData?.scopes ?? []);
}

async function checkHasChannelAccess(token: string, channelId: string, slackUserId: string) {
  try {
    const { channel } = await slackClient.conversations.info({ token, channel: channelId });
    const isPublic = channel?.is_channel && !channel.is_private;
    return isPublic || checkHasTeamMemberAllSlackUserScopes(slackUserId);
  } catch (error) {
    if (isChannelNotFoundError(error)) {
      return false;
    } else {
      throw error;
    }
  }
}

interface RequestSlackAuthorizedOrOpenAuthModalInput {
  channelId?: string;
  slackUserId: string;
  triggerId: string;
  slackTeamId?: string;
  context: Context;
}

export interface SlackAuthorizedData {
  user: User;
  team: Team;
}

export async function requestSlackAuthorizedOrOpenAuthModal({
  channelId,
  slackTeamId,
  slackUserId,
  triggerId,
  context,
}: RequestSlackAuthorizedOrOpenAuthModalInput): Promise<SlackAuthorizedData | false> {
  const token = assertToken(context);

  const openView = async (view: View) => {
    await slackClient.views.open({ token, trigger_id: triggerId, view });
  };

  const [user, team] = await Promise.all([
    findUserBySlackId(token, slackUserId),
    db.team.findFirst({
      where: { team_slack_installation: { slack_team_id: slackTeamId } },
      include: { team_slack_installation: true },
    }),
  ]);

  if (!team) {
    await openView(MissingTeamModal);
    return false;
  }

  if (!user) {
    await openView(MissingUserModal);
    return false;
  }

  const hasChannelAccess = !channelId || (await checkHasChannelAccess(token, channelId, slackUserId));

  const hasAllBotScopes = checkHasSlackInstallationAllBotScopes(team.team_slack_installation?.data);
  if (!hasChannelAccess || !hasAllBotScopes) {
    await openView(await AuthRequestModal(token, slackUserId, team.id, hasAllBotScopes));
    return false;
  }

  return { user, team };
}

export async function requestSlackAuthorizedOrOpenAuthModalForSlashCommand(req: SlashCommandRequest) {
  return requestSlackAuthorizedOrOpenAuthModal({
    channelId: req.body.channel_id,
    slackUserId: req.body.user_id,
    triggerId: req.body.trigger_id,
    context: req.context,
    slackTeamId: req.body.team_id,
  });
}

export async function requestSlackAuthorizedOrOpenAuthModalForMessageShortcut(request: MessageShortcutRequest) {
  const {
    shortcut: { channel },
    context,
    body: {
      user: { id: slackUserId, team_id: slackTeamId },
      trigger_id: triggerId,
    },
  } = request;

  const channelId = channel.id;

  return await requestSlackAuthorizedOrOpenAuthModal({
    context,
    triggerId,
    slackUserId,
    slackTeamId,
    channelId,
  });
}
