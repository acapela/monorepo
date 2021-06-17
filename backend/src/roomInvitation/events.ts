import { RoomParticipants, User } from "~db";
import { UnprocessableEntityError } from "~backend/src/errors";
import { findRoomById } from "~backend/src/rooms/rooms";
import { findUserById } from "~backend/src/users/users";
import { RoomAddedNotification } from "~backend/src/roomInvitation/RoomAddedNotification";
import { sendNotification } from "~backend/src/notifications/sendNotification";
import logger from "~shared/logger";

export async function handleRoomParticipantAdded(invite: RoomParticipants, userId: string | null) {
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

  if (!addedUser || !inviter || !room) {
    throw new UnprocessableEntityError(
      `Added user ${addedUserId} or inviter ${userId} or room ${roomId} does not exist`
    );
  }
  if (!addedUser.email) {
    throw new UnprocessableEntityError(`invalid user entry: ${addedUserId}`);
  }
  if (!room.space_id) {
    throw new UnprocessableEntityError(`invalid room entry: ${roomId}`);
  }

  const notification = new RoomAddedNotification({
    recipientEmail: addedUser.email,
    inviterName: getInviterName(inviter),
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

function getInviterName(inviter: User): string {
  if (inviter.name) {
    return firstName(inviter.name);
  }
  if (inviter.email) {
    return inviter.email;
  }
  return "Your colleague";
}

function firstName(name: string): string {
  return name.trim().split(" ")[0];
}
