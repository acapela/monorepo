import { TeamMember, db } from "~db";

import { HasuraEvent } from "../hasura";

export async function handleTeamMemberDeleted({ item: teamMember }: HasuraEvent<TeamMember>) {
  const { team_id: teamId, user_id: userId } = teamMember;

  await db.$transaction([
    // remove user's current_team_id
    db.user.update({ where: { id: userId }, data: { current_team_id: null } }),

    db.team_invitation.deleteMany({
      where: {
        used_by_user_id: userId,
        team_id: teamId,
      },
    }),
  ]);
}
