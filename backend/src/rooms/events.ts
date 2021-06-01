import { Room } from "~db";
import logger from "~shared/logger";
import { UnprocessableEntityError } from "../errors";
import { addRoomParticipant, getIfParticipantExists } from "./rooms";

export async function handleRoomUpdates(room: Room, userId: string | null) {
  const { creator_id: creatorId, id: roomId } = room;

  if (!userId) return;

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

function checkUserIdMatchesCreatorId(userId: string, creatorId: string): void {
  if (userId !== creatorId) {
    logger.error("User id of action caller does not match room creator", {
      creatorId,
      userId,
    });
    throw new UnprocessableEntityError(`User id of action caller: ${userId} does not match room creator: ${creatorId}`);
  }
}
