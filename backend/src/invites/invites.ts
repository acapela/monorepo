import { Knex } from "knex";
import database from "../database";

export async function findInviteByCode(code: string): Promise<Invite | null> {
  const [databaseInvite] = await database
    .select(["id", "room_id", "inviter_id", "code", "email", "created_at", "used_at"])
    .from("room_invites")
    .where({ code })
    .limit(1);

  if (databaseInvite) {
    return convertDatabaseInvite(databaseInvite);
  }

  return null;
}

export async function markInviteAsUsed(invite: Invite, transaction: Knex = database): Promise<Invite | null> {
  return updateInvite(
    {
      ...invite,
      usedAt: new Date(),
    },
    transaction
  );
}

export interface InviteCreationParameters {
  inviterId: string;
  roomId: string;
  email: string;
}

// This is only here for simpler testing. Never use this in production, go through hasura instead.
export async function createInviteForTests(invite: InviteCreationParameters): Promise<Invite> {
  const [databaseInvite] = await database("room_invites")
    .insert({
      inviter_id: invite.inviterId,
      room_id: invite.roomId,
      email: invite.email,
    })
    .returning(["id", "room_id", "inviter_id", "code", "email", "created_at", "used_at"])
    .limit(1);
  return convertDatabaseInvite(databaseInvite);
}

async function updateInvite(invite: Invite, transaction: Knex = database): Promise<Invite | null> {
  const [databaseInvite] = await transaction("room_invites")
    .where({ id: invite.id })
    .update(convertInvite(invite))
    .returning(["id", "room_id", "inviter_id", "code", "email", "created_at", "used_at"])
    .limit(1);
  if (databaseInvite) {
    return convertDatabaseInvite(databaseInvite);
  }
  return null;
}

export interface Invite {
  id: string;
  roomId: string;
  inviterId: string;
  code: string;
  email: string;
  createdAt: Date;
  usedAt?: Date;
}

interface DatabaseInvite {
  id: string;
  room_id: string;
  inviter_id: string;
  code: string;
  email: string;
  created_at: string;
  used_at?: string;
}

function convertDatabaseInvite(invite: DatabaseInvite): Invite {
  return {
    id: invite.id,
    roomId: invite.room_id,
    inviterId: invite.inviter_id,
    code: invite.code,
    email: invite.email,
    createdAt: new Date(invite.created_at),
    usedAt: invite.used_at ? new Date(invite.used_at) : undefined,
  };
}

function convertInvite(invite: Invite): DatabaseInvite {
  return {
    id: invite.id,
    room_id: invite.roomId,
    inviter_id: invite.inviterId,
    code: invite.code,
    email: invite.email,
    created_at: invite.createdAt.toISOString(),
    used_at: invite.usedAt ? invite.usedAt.toISOString() : undefined,
  };
}
