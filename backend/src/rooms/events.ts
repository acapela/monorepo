import logger from "~shared/logger";
import { UnprocessableEntityError } from "../errors";
import { EventHandler } from "../events/eventHandlers";
import { addRoomParticipant, getIfParticipantExists } from "./rooms";

interface HasuraRoom {
  id: string;
  creator_id: string;
}

export const handleRoomCreated: EventHandler<HasuraRoom> = {
  triggerName: "room_created",
  handleInsert: async (userId: string, room: HasuraRoom) => {
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
  },
};

function checkUserIdMatchesCreatorId(userId: string, creatorId: string): void {
  if (userId !== creatorId) {
    logger.error("User id of action caller does not match room creator", {
      creatorId,
      userId,
    });
    throw new UnprocessableEntityError(`User id of action caller: ${userId} does not match room creator: ${creatorId}`);
  }
}
