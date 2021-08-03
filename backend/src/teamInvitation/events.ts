import { db, TeamInvitation } from "~db";
import logger from "~shared/logger";
import { UnprocessableEntityError } from "../errors/errorTypes";
import { HasuraEvent } from "../hasura";
import { sendNotification } from "../notifications/sendNotification";
import { findTeamById } from "../teams/helpers";
import { findUserById, getNormalizedUserName } from "../users/users";
import { TeamInvitationNotification } from "./InviteNotification";

export async function handleTeamInvitationCreated({ item: invite, userId }: HasuraEvent<TeamInvitation>) {
  const { team_id: teamId, inviting_user_id: invitingUserId, email } = invite;

  if (userId !== invitingUserId) {
    throw new UnprocessableEntityError(
      `Inviter id: ${invitingUserId} does not match user making the modification: ${userId}`
    );
  }

  const [team, inviter] = await Promise.all([findTeamById(teamId), findUserById(invitingUserId)]);

  if (!team || !inviter) {
    throw new UnprocessableEntityError(`Team ${teamId} or inviter ${invitingUserId} does not exist`);
  }

  const roomInvitation = await db.room_invitation.findFirst({
    where: {
      email,
      team_id: teamId,
    },
    include: {
      room: true,
    },
  });

  const notification = new TeamInvitationNotification({
    recipientEmail: email,
    invitationToJoin: roomInvitation ? "room" : "team",
    destinationName: roomInvitation?.room?.name || team.name,
    inviterName: getNormalizedUserName(inviter),
    inviteCode: invite.token,
  });

  await sendNotification(notification);

  logger.info("Sent invite notification", {
    userId,
    teamId,
  });
}

export const handleTeamInviationDeleted = async ({ item: invite }: HasuraEvent<TeamInvitation>) => {
  const { team_id: teamId, email } = invite;

  await db.room_invitation.deleteMany({
    where: {
      team_id: teamId,
      email,
    },
  });
};
