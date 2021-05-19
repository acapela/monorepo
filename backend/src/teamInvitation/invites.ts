import { db, TeamInvitation } from "~db";

export async function findInviteByCode(token: string): Promise<TeamInvitation | null> {
  return await db.team_invitation.findUnique({
    where: { token },
  });
}

export async function invalidateInvite(inviteId: string): Promise<TeamInvitation> {
  return await db.team_invitation.update({
    where: {
      id: inviteId,
    },
    data: {
      used_at: new Date(),
    },
  });
}

export interface InviteCreationParameters {
  inviterId: string;
  teamId: string;
  email: string;
}

// This is only here for simpler testing. Never use this in production, go through hasura instead.
export async function createInviteForTests(invite: InviteCreationParameters): Promise<TeamInvitation> {
  return await db.team_invitation.create({
    data: {
      inviting_user_id: invite.inviterId,
      team_id: invite.teamId,
      email: invite.email,
    },
  });
}
