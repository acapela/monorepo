import { ViewsOpenArguments } from "@slack/web-api";

import { SlackInstallation, slackClient } from "~backend/src/slack/app";
import { isWebAPIErrorType } from "~backend/src/slack/errors";
import { User, db } from "~db";

export async function fetchTeamBotToken(teamId: string) {
  const slackInstallation = await db.team_slack_installation.findUnique({ where: { team_id: teamId } });
  if (!slackInstallation) {
    return;
  }
  return (slackInstallation.data as unknown as SlackInstallation)?.bot?.token;
}

// finds a slack user either through the team_member's slack installation or by email
export async function findSlackUserId(teamId: string, user: User) {
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

export async function findUserBySlackId(slackToken: string, slackUserId: string, teamId?: string) {
  const user = await db.user.findFirst({
    where: { team_member: { some: { team_id: teamId, team_member_slack: { slack_user_id: slackUserId } } } },
  });
  if (user) {
    return user;
  }

  const { profile } = await slackClient.users.profile.get({ token: slackToken, user: slackUserId });
  if (!profile) {
    return;
  }
  return await db.user.findFirst({ where: { team_member: { some: { team_id: teamId } }, email: profile.email } });
}

export const createLinkSlackWithAcapelaView = ({ triggerId }: { triggerId: string }): ViewsOpenArguments => ({
  trigger_id: triggerId,
  view: {
    type: "modal",
    title: { type: "plain_text", text: "We could not find you" },
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            "We could not find a user with your email on Acapela.",
            `<${process.env.FRONTEND_URL}/team|Connect Acapela with Slack> to use this feature.`,
          ].join(" "),
        },
      },
    ],
  },
});
