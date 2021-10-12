import { TeamMember, db } from "~db";

import { HasuraEvent } from "../hasura";

export async function handleTeamMemberDeleted({ item: teamMember }: HasuraEvent<TeamMember>) {
  // remove user's current_team_id
  await db.user.update({ where: { id: teamMember.user_id }, data: { current_team_id: null } });
}
