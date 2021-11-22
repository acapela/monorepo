import { TeamMember, db } from "~db";
import { trackBackendUserEvent } from "~shared/backendAnalytics";

import { HasuraEvent } from "../hasura";

export async function handleTeamMemberDeleted({ userId, item: teamMember }: HasuraEvent<TeamMember>) {
  // remove user's current_team_id
  const deletedUser = await db.user.update({ where: { id: teamMember.user_id }, data: { current_team_id: null } });

  if (userId) {
    if (teamMember.has_joined) {
      // person accepted the invite
      trackBackendUserEvent(userId, "Account Removed User", {
        teamId: teamMember.team_id,
        userId: teamMember.user_id,
      });
    } else {
      // the invite had not been accepted yet
      trackBackendUserEvent(userId, "Deleted Invite", {
        teamId: teamMember.team_id,
        email: deletedUser.email,
      });
    }
  }
}
