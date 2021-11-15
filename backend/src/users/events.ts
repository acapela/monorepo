import { User, db } from "~db";
import { assert } from "~shared/assert";
import { identifyBackendUserTeam, trackFirstBackendUserEvent } from "~shared/backendAnalytics";

import { HasuraEvent } from "../hasura";

export async function handleUserUpdates(event: HasuraEvent<User>) {
  const userBefore = event.itemBefore;
  const userNow = event.item;

  const hadTeamBeforeUpdate = !!(userBefore && userBefore.current_team_id);
  const hasChangedTeam = userNow.current_team_id !== userBefore?.current_team_id;

  if (userNow.current_team_id && (hasChangedTeam || !hadTeamBeforeUpdate)) {
    const team = await db.team.findFirst({ where: { id: userNow.current_team_id } });
    assert(team, "Team does not exist");

    trackFirstBackendUserEvent(userNow, "Account Added User", {
      teamId: team.id,
      userEmail: userNow.email,
    });

    identifyBackendUserTeam(userNow.id, team.id, {
      id: team.id,
      name: team.name,
      slug: team.slug,
      plan: "trial",
      createdAt: team.created_at,
    });

    await db.team_member.updateMany({
      where: { user_id: userNow.id, team_id: team.id },
      data: { has_joined: true },
    });
  }
}
