import { db, Room } from "~db";
import logger from "~shared/logger";
import { HasuraEvent } from "../hasura";
import { createNotification } from "../notifications/entity";
import { addRoomParticipant, getIfParticipantExists } from "./rooms";

async function ensureOwnerIsRoomMember(room: Room) {
  const { creator_id: creatorId, id: roomId } = room;

  const creatorIsAlreadyParticipant = await getIfParticipantExists(roomId, creatorId);
  if (!creatorIsAlreadyParticipant) {
    logger.info("Adding creator as participant to room", {
      roomId: room.id,
      creatorId,
    });
    await addRoomParticipant(roomId, creatorId);
  } else {
    logger.info("Skipping adding creator as participant, as they are already there", {
      roomId: room.id,
      creatorId,
    });
  }
}

async function createRoomClosedNotifications(room: Room, closedByUserId: string) {
  const roomMembers = await db.room_member.findMany({ where: { room_id: room.id } });

  const notificationCreateRequests = roomMembers.map((roomMember) => {
    return createNotification({
      type: "roomClosed",
      userId: roomMember.user_id,
      payload: { roomId: room.id, closedByUserId },
    });
  });

  return db.$transaction(notificationCreateRequests);
}

export async function handleRoomUpdates({ item: room, itemBefore: roomBefore, userId }: HasuraEvent<Room>) {
  await ensureOwnerIsRoomMember(room);

  const wasRoomJustClosed = room.finished_at && roomBefore && !roomBefore.finished_at;

  if (wasRoomJustClosed && userId) {
    await createRoomClosedNotifications(room, userId);
  }
}
