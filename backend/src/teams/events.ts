import { Team, db } from "~db";
import { log } from "~shared/logger";

import { UnprocessableEntityError } from "../errors/errorTypes";
import { HasuraEvent } from "../hasura";
import { getHasTeamMember } from "./helpers";

export async function handleTeamUpdates({ userId, item: team }: HasuraEvent<Team>) {
  const { owner_id: ownerId, id: teamId } = team;
  if (userId !== ownerId) {
    log.error("User id of action caller does not match room creator", {
      ownerId,
      userId,
    });
    throw new UnprocessableEntityError(`User id of action caller: ${userId} does not match room creator: ${ownerId}`);
  }

  const creatorIsAlreadyParticipant = await getHasTeamMember(teamId, userId);
  if (creatorIsAlreadyParticipant) {
    log.info("Skipping adding creator as participant, as they are already there", {
      roomId: team.id,
      ownerId,
    });
    return;
  }

  log.info("Adding creator as participant to room", {
    roomId: team.id,
    ownerId,
  });
  await db.team_member.create({
    data: {
      team_id: teamId,
      user_id: ownerId,
    },
  });
}
