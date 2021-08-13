import { db, TeamInvitation } from "~db";
import { findTeamById } from "~backend/src/teams/helpers";
import { findUserById, getNormalizedUserName } from "~backend/src/users/users";
import { UnprocessableEntityError } from "~backend/src/errors/errorTypes";
import { TeamInvitationNotification } from "./InviteNotification";
import { sendNotification } from "~backend/src/notifications/sendNotification";
import logger from "~shared/logger";

export const sendInviteNotification = async (invite: TeamInvitation, userId: string | null) => {
  const { email, inviting_user_id: invitingUserId, team_id: teamId } = invite;

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
    roomName: roomInvitation?.room?.name,
    teamName: team.name,
    inviterName: getNormalizedUserName(inviter),
    inviteCode: invite.token,
  });

  await sendNotification(notification);

  logger.info("Sent invite notification", {
    userId,
    teamId,
  });
};
