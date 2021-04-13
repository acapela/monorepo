import { db, RoomInvites } from "~db";

export async function findInviteByCode(code: string): Promise<RoomInvites | null> {
  return await db.room_invites.findUnique({
    where: { code },
    select: {
      id: true,
      room_id: true,
      inviter_id: true,
      code: true,
      email: true,
      created_at: true,
      used_at: true,
    },
  });
}

export async function invalidateInvite(invite: RoomInvites): Promise<RoomInvites> {
  return await db.room_invites.update({
    where: {
      id: invite.id,
    },
    data: {
      used_at: new Date(),
    },
  });
}

export interface InviteCreationParameters {
  inviterId: string;
  roomId: string;
  email: string;
}

// This is only here for simpler testing. Never use this in production, go through hasura instead.
export async function createInviteForTests(invite: InviteCreationParameters): Promise<RoomInvites> {
  return await db.room_invites.create({
    data: {
      inviter_id: invite.inviterId,
      room_id: invite.roomId,
      email: invite.email,
    },
    select: {
      id: true,
      room_id: true,
      inviter_id: true,
      code: true,
      email: true,
      created_at: true,
      used_at: true,
    },
  });
}
