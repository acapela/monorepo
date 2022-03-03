import { User, db } from "@aca/db";
import { assert } from "@aca/shared/assert";

import { HasuraEvent } from "../hasura";

export async function handleUserUpdates(event: HasuraEvent<User>) {
  const userBefore = event.itemBefore;
  const userNow = event.item;

  const hadTeamBeforeUpdate = !!(userBefore && userBefore.current_team_id);
  const teamId = userNow.current_team_id;
  const hasChangedTeam = teamId !== userBefore?.current_team_id;

  // check whether user has changed teams or was invited to their first team
  if (teamId && (hasChangedTeam || !hadTeamBeforeUpdate)) {
    const team = await db.team.findFirst({ where: { id: teamId } });
    assert(team, `Team ${teamId} does not exist at user update`);

    await db.team_member.updateMany({
      where: { user_id: userNow.id, team_id: team.id },
      data: { has_joined: true },
    });

    // for the time being, we only want to track the first team a user joins
    // if (!hadTeamBeforeUpdate) {
    //   identifyBackendUser(userNow.id, {
    //     id: userNow.id,
    //     name: userNow.name,
    //     email: userNow.email,
    //     createdAt: userNow.created_at,
    //     avatar: userNow.avatar_url,
    //     isSlackInstalled: false,
    //   });
    //   identifyBackendUserTeam(userNow.id, team.id);
    // }
  }
}
