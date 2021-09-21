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
