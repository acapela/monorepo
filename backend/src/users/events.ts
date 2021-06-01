import { db, User } from "~db";
import { acceptTeamInvitation } from "../teamInvitation/acceptInvite";

export async function handleUserCreated(user: User) {
  await acceptAllNewUserInvitations(user);
}

async function acceptAllNewUserInvitations(user: User) {
  const userEmail = user.email;

  if (!userEmail) return;

  const invitations = await db.team_invitation.findMany({ where: { email: userEmail } });

  if (!invitations.length) return;

  await Promise.all(
    invitations.map((invitation) => {
      return acceptTeamInvitation(invitation, user.id);
    })
  );
}
