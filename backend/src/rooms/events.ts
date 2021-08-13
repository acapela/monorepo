import { db, Room } from "~db";
import logger from "~shared/logger";
import { HasuraEvent } from "../hasura";
import { createNotification } from "../notifications/entity";
import { addRoomParticipant, getIfParticipantExists, updateRoomLastActivityDate } from "./rooms";

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

  const notificationCreateRequests = roomMembers
    // Don't send notification to user who closed the room.
    .filter((roomMember) => roomMember.user_id !== closedByUserId)
    .map((roomMember) => {
      // Don't send notification to user who closed the room.

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
  await updateRoomLastActivityDate(room.id);

  const wasRoomJustClosed = room.finished_at && roomBefore && !roomBefore.finished_at;

  if (wasRoomJustClosed && userId) {
    await createRoomClosedNotifications(room, userId);
  }
}
