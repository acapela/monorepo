import { TeamMember, db } from "~db";
import { assert } from "~shared/assert";
import { trackBackendUserEvent } from "~shared/backendAnalytics";

import { createOnboardingTopicsWithBot } from "../bot/createOnboardingTopics";
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

export async function handleTeamMemberAdded({ type, item: teamMember }: HasuraEvent<TeamMember>) {
  if (type !== "create") return;

  const user = await db.user.findUnique({ where: { id: teamMember.user_id } });

  assert(user, `Cannot create onboarding - no user with id ${teamMember.user_id}`);

  if (user.is_bot) return;

  await createOnboardingTopicsWithBot(teamMember.user_id, teamMember.team_id);
}
