import { TeamMember, db } from "~db";
import { trackBackendUserEvent } from "~shared/backendAnalytics";

import { HasuraEvent } from "../hasura";

export async function handleTeamMemberDeleted({ item: teamMember }: HasuraEvent<TeamMember>) {
  // remove user's current_team_id
  trackBackendUserEvent(teamMember.user_id, "Account Removed User", {
    teamId: teamMember.team_id,
    userId: teamMember.user_id,
  });
  await db.user.update({ where: { id: teamMember.user_id }, data: { current_team_id: null } });
}
