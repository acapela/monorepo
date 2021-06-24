import { Team } from "~db";
import logger from "~shared/logger";
import { UnprocessableEntityError } from "../errors/errorTypes";
import { addTeamMember, getHasTeamMember } from "./helpers";

export async function handleTeamUpdates(team: Team, userId: string | null) {
  const { owner_id: ownerId, id: teamId } = team;
  if (userId !== ownerId) {
    logger.error("User id of action caller does not match room creator", {
      ownerId,
      userId,
    });
    throw new UnprocessableEntityError(`User id of action caller: ${userId} does not match room creator: ${ownerId}`);
  }

  const creatorIsAlreadyParticipant = await getHasTeamMember(teamId, userId);
  if (creatorIsAlreadyParticipant) {
    logger.info("Skipping adding creator as participant, as they are already there", {
      roomId: team.id,
      ownerId,
    });
    return;
  }

  logger.info("Adding creator as participant to room", {
    roomId: team.id,
    ownerId,
  });
  await addTeamMember(teamId, ownerId);
}
