import { db, Room, RoomInvites, RoomParticipants } from "@acapela/db";

export async function findRoomById(roomId: string): Promise<Room | null> {
  return await db.room.findUnique({
    where: { id: roomId },
    select: {
      id: true,
      creator_id: true,
      name: true,
      created_at: true,
      deadline: true,
      notification_job_id: true,
      summary: true,
      finished_at: true,
    },
  });
}

// Used in tests
export async function createRoom({ creatorId, name }: { creatorId: string; name: string }): Promise<Room> {
  return await db.room.create({
    data: {
      creator_id: creatorId,
      name,
    },
  });
}

export async function addRoomParticipant(roomId: string, participantId: string): Promise<RoomParticipants> {
  return await db.room_participants.create({
    data: {
      room_id: roomId,
      user_id: participantId,
    },
  });
}

// Transactional
export async function addRoomParticipantAndInvalidateInvite(invite: RoomInvites, participantId: string): Promise<Room> {
  return await db.room.update({
    where: {
      id: invite.room_id,
    },
    data: {
      room_invites: {
        update: {
          where: {
            id: invite.id,
          },
          data: {
            used_at: new Date(),
          },
        },
      },
      room_participants: {
        create: {
          user_id: participantId,
        },
      },
    },
  });
}

export async function getIfParticipantExists(roomId: string, participantId: string): Promise<boolean> {
  const entry = await db.room_participants.count({
    where: { room_id: roomId, user_id: participantId },
  });

  return !!entry;
}
