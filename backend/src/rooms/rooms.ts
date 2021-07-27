import { db, Room, RoomParticipants } from "~db";

export async function findRoomById(roomId: string): Promise<Room | null> {
  return await db.room.findUnique({
    where: { id: roomId },
  });
}

export async function addRoomParticipant(roomId: string, participantId: string): Promise<RoomParticipants> {
  return await db.room_member.create({
    data: {
      room_id: roomId,
      user_id: participantId,
    },
  });
}

export async function getIfParticipantExists(roomId: string, participantId: string): Promise<boolean> {
  const entry = await db.room_member.count({
    where: { room_id: roomId, user_id: participantId },
  });

  return !!entry;
}
