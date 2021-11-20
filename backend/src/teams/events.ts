import { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, slackClient } from "~backend/src/slack/app";
import { extractInstallationDataBotToken } from "~backend/src/slack/utils";
import { Team, TeamSlackInstallation, db } from "~db";
import { assert } from "~shared/assert";
import { identifyBackendUserTeam, trackBackendUserEvent } from "~shared/backendAnalytics";
import { log } from "~shared/logger";

import { UnprocessableEntityError } from "../errors/errorTypes";
import { HasuraEvent } from "../hasura";
import { getHasTeamMember } from "./helpers";

export async function handleTeamUpdates(event: HasuraEvent<Team>) {
  const { userId, item: team } = event;
  const { owner_id: ownerId, id: teamId } = team;
  if (userId !== ownerId) {
    log.error("User id of action caller does not match room creator", {
      ownerId,
      userId,
    });
    throw new UnprocessableEntityError(`User id of action caller: ${userId} does not match room creator: ${ownerId}`);
  }
  assert(ownerId, "team must have owner id");

  if (event.type === "create") {
    trackBackendUserEvent(ownerId, "Account Created", { teamName: team.name });
    trackBackendUserEvent(ownerId, "Trial Started", { teamName: team.name });
    // owner also counts as a user
    trackBackendUserEvent(ownerId, "Account Added User", {
      teamId: team.id,
    });
    identifyBackendUserTeam(ownerId, team.id, {
      id: team.id,
      name: team.name,
      slug: team.slug,
      plan: "trial",
      createdAt: team.created_at,
      isSlackInstalled: false,
    });
  }

  const creatorIsAlreadyParticipant = await getHasTeamMember(teamId, userId);
  if (creatorIsAlreadyParticipant) {
    log.info("Skipping adding creator as participant, as they are already there", {
      roomId: team.id,
      ownerId,
    });
    return;
  }

  log.info("Adding team owner as participant to team", {
    roomId: team.id,
    ownerId,
  });
  await db.team_member.create({
    data: {
      team_id: teamId,
      user_id: ownerId,
      // we assume that the owner of a team also has joined the team
      has_joined: true,
    },
  });
}

export async function handleTeamSlackInstallationDelete(event: HasuraEvent<TeamSlackInstallation>) {
  if (event.type == "delete") {
    await db.team_member_slack.deleteMany({ where: { team_member: { team_id: event.item.team_id } } });
    const botToken = extractInstallationDataBotToken(event.item.data);
    assert(botToken, "must have bot token");
    await slackClient.apps.uninstall({
      token: botToken,
      client_id: SLACK_CLIENT_ID,
      client_secret: SLACK_CLIENT_SECRET,
    });
    if (event.userId) {
      trackBackendUserEvent(event.userId, "Removed Team Slack Integration", { teamId: event.item.team_id });
    }
  }
}
