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
  const teamMemberSlackInstallation = await db.team_member_slack_installation.findFirst({
    where: { team_member: { team_id: teamId, user_id: user.id } },
  });
  if (teamMemberSlackInstallation) {
    return teamMemberSlackInstallation.slack_user_id;
  }

  const token = await fetchTeamBotToken(teamId);
  if (!token || !user.email) {
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

// Finds a user for a Slack user id either through a team_member's slack installation, team_invitation or by email
export async function findUserBySlackId(slackToken: string, slackUserId: string, teamId?: string) {
  const user = await db.user.findFirst({
    where: {
      team_member: { some: { team_id: teamId } },
      OR: [
        { team_member: { some: { team_member_slack_installation: { slack_user_id: slackUserId } } } },
        { team_invitation_team_invitation_used_by_user_idTouser: { some: { slack_user_id: slackUserId } } },
      ],
    },
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
