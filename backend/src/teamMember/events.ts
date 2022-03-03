import { TeamMember, db } from "@aca/db";
import { assert } from "@aca/shared/assert";

import { createOnboardingTopicsWithBot } from "../bot/createOnboardingTopics";
import { HasuraEvent } from "../hasura";

export async function handleTeamMemberDeleted({ item: teamMember }: HasuraEvent<TeamMember>) {
  // remove user's current_team_id
  await db.user.update({ where: { id: teamMember.user_id }, data: { current_team_id: null } });

  // if (userId) {
  //   if (teamMember.has_joined) {
  //     // person accepted the invite
  //     trackBackendUserEvent(userId, "Account Removed User", {
  //       teamId: teamMember.team_id,
  //       userId: teamMember.user_id,
  //     });
  //   } else {
  //     // the invite had not been accepted yet
  //     trackBackendUserEvent(userId, "Deleted Invite", {
  //       teamId: teamMember.team_id,
  //       email: deletedUser.email,
  //     });
  //   }
  // }
}

export async function handleTeamMemberAdded({ type, item: teamMember }: HasuraEvent<TeamMember>) {
  if (type !== "create") return;

  const user = await db.user.findUnique({ where: { id: teamMember.user_id } });

  assert(user, `Cannot create onboarding - no user with id ${teamMember.user_id}`);

  if (user.is_bot) return;

  // TODO: We had quite complex problems with e2e tests if creating onboarding for each test in e2e.
  // We should address it in some solid way.
  if (process.env.CI) {
    return;
  }

  await createOnboardingTopicsWithBot(teamMember.user_id, teamMember.team_id);
}
