import { db, User } from "~db";
import { HasuraEvent } from "../hasura";
import { trackBackendUserEvent } from "~shared/backendAnalytics";

export async function handleUserCreated({ item: user }: HasuraEvent<User>) {
  await acceptAllNewUserInvitations(user);

  trackBackendUserEvent(user, "Account Added User");
}

async function acceptAllNewUserInvitations(user: User) {
  const userEmail = user.email;

  if (!userEmail) return;

  const teamInvitations = await db.team_invitation.findMany({ where: { email: userEmail } });
  const roomInvitations = await db.room_invitation.findMany({ where: { email: userEmail } });

  if (teamInvitations.length < 1 && roomInvitations.length < 1) return;

  /*
  TODO: Use the invitation code used during sign-up to determine which team the user joined.
  Now, if the user has an invitation to two different teams, we pick the team randomly.
  */
  const [{ team_id: teamId }] = [...teamInvitations, ...roomInvitations];

  const usedInvitationAt = new Date();

  const updateInvitationBody = {
    where: {
      email: userEmail,
      team_id: teamId,
    },
    data: {
      used_at: usedInvitationAt,
      used_by_user_id: user.id,
    },
  };

  await db.$transaction([
    db.team_invitation.updateMany(updateInvitationBody),
    db.room_invitation.updateMany(updateInvitationBody),
  ]);

  // If user is accepting team invite - set it as current team for this user
  await db.user.update({ where: { id: user.id }, data: { current_team_id: teamId } });

  await db.team_member.create({
    data: {
      team_id: teamId,
      user_id: user.id,
    },
  });
}
