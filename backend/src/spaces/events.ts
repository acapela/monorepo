import { Space } from "~db";
import logger from "~shared/logger";
import { UnprocessableEntityError } from "../errors/errorTypes";
import { HasuraEvent } from "../hasura";
import { addSpaceMember, getSpaceHasMember } from "./helpers";

export async function handleSpaceUpdates({ item: space, userId }: HasuraEvent<Space>) {
  const { creator_id: creatorId, id: spaceId } = space;
  if (userId !== creatorId) {
    logger.error("User id of action caller does not match room creator", {
      creatorId,
      userId,
    });
    throw new UnprocessableEntityError(`User id of action caller: ${userId} does not match room creator: ${creatorId}`);
  }

  const isAlreadyMember = await getSpaceHasMember(spaceId, userId);

  if (isAlreadyMember) {
    logger.info("Skipping adding creator as participant, as they are already there", {
      roomId: space.id,
      creatorId,
    });
    return;
  }

  logger.info("Adding creator as participant to room", {
    roomId: space.id,
    creatorId,
  });
  await addSpaceMember(spaceId, creatorId);
}
