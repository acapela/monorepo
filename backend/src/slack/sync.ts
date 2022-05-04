import { slackClient } from "@aca/backend/src/slack/app";
import { UserSlackInstallation, db } from "@aca/db";
import { assert } from "@aca/shared/assert";
import { logger } from "@aca/shared/logger";

import { getSlackInstallationData } from "./utils";

export async function syncUserSlackInstallationTeam(installation: UserSlackInstallation) {
  try {
    const { token, scopes } = getSlackInstallationData(installation).user;
    assert(scopes?.includes("team:read"), "Missing scope team:read");
    const slackTeamId = installation.slack_team_id;
    const { team } = await slackClient.team.info({ token, team: slackTeamId });
    assert(team, `Could not find team ${slackTeamId}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const teamData = team as any;
    await db.slack_team.upsert({
      where: { slack_team_id: slackTeamId },
      create: {
        slack_team_id: slackTeamId,
        team_info_data: teamData,
      },
      update: { team_info_data: teamData },
    });
  } catch (error) {
    logger.error(error, `Error syncing slack team for user_slack_installtion ${installation.id}`);
  }
}

export async function syncSlackTeams() {
  const slackInstallationsPerTeam = await db.user_slack_installation.findMany({ distinct: ["slack_team_id"] });
  for (const installation of slackInstallationsPerTeam) {
    await syncUserSlackInstallationTeam(installation);
  }
}
