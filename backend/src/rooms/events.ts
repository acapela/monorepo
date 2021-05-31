import { db, Room } from "~db";
import logger from "~shared/logger";
import { UnprocessableEntityError } from "../errors";
import { addRoomParticipant, getIfParticipantExists } from "./rooms";

export async function handleRoomUpdates(room: Room, userId: string) {
  const { creator_id: creatorId, id: roomId } = room;
  checkUserIdMatchesCreatorId(userId, creatorId);

  const creatorIsAlreadyParticipant = await getIfParticipantExists(roomId, userId);
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

export async function handleRoomCreated(room: Room) {
  await inheritRoomMembersFromParentSpace(room);
}

async function inheritRoomMembersFromParentSpace(room: Room) {
  if (!room.space_id) return;

  // Get all parent space members.
  const spaceMembers = await db.space.findFirst({
    where: { id: room.space_id },
    select: { space_member: { select: { user_id: true } } },
  });

  if (!spaceMembers) return;

  // Now we'll pick user id's of space members and create corresponding room_member entities.

  const spaceMemberIds = spaceMembers.space_member.map((member) => member.user_id);

  await db.room_member.createMany({
    data: spaceMemberIds.map((userId) => {
      return {
        user_id: userId,
        room_id: room.id,
      };
    }),
    // This should never happen as the room is just created so it should have no members yet.
    skipDuplicates: true,
  });
}

function checkUserIdMatchesCreatorId(userId: string, creatorId: string): void {
  if (userId !== creatorId) {
    logger.error("User id of action caller does not match room creator", {
      creatorId,
      userId,
    });
    throw new UnprocessableEntityError(`User id of action caller: ${userId} does not match room creator: ${creatorId}`);
  }
}
