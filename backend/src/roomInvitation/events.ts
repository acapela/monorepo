import { RoomParticipants } from "~db";
import { UnprocessableEntityError } from "~backend/src/errors/errorTypes";
import { findRoomById } from "~backend/src/rooms/rooms";
import { findUserById, getNormalizedUserName } from "~backend/src/users/users";
import { RoomAddedNotification } from "~backend/src/roomInvitation/RoomAddedNotification";
import { sendNotification } from "~backend/src/notifications/sendNotification";
import logger from "~shared/logger";

export async function handleRoomParticipantCreated(invite: RoomParticipants, userId: string | null) {
  const { room_id: roomId, user_id: addedUserId } = invite;

  if (userId === addedUserId) {
    // user added themselves
    return;
  }

  if (!userId) {
    throw new UnprocessableEntityError("user id missing");
  }

  const [addedUser, inviter, room] = await Promise.all([
    findUserById(addedUserId),
    findUserById(userId),
    findRoomById(roomId),
  ]);

  if (!addedUser) {
    throw new UnprocessableEntityError(`added user ${addedUserId} does not exist`);
  }
  if (!inviter) {
    throw new UnprocessableEntityError(`inviter ${userId} does not exist`);
  }
  if (!room) {
    throw new UnprocessableEntityError(`room ${roomId} does not exist`);
  }
  if (!addedUser.email) {
    throw new UnprocessableEntityError(`invalid user entry: ${addedUserId}`);
  }
  if (!room.space_id) {
    throw new UnprocessableEntityError(`invalid room entry: ${roomId}`);
  }

  const notification = new RoomAddedNotification({
    recipientEmail: addedUser.email,
    inviterName: getNormalizedUserName(inviter),
    roomName: room.name || "an acapela discussion",
    spaceId: room.space_id,
    roomId: room.id,
  });

  await sendNotification(notification);

  logger.info("Sent room added notification", {
    roomId,
    userId,
    addedUserId,
  });
}
