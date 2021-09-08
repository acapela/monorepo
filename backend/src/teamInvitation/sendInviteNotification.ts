import { UnprocessableEntityError } from "~backend/src/errors/errorTypes";
import { findTeamById } from "~backend/src/teams/helpers";
import { findUserById, getNormalizedUserName } from "~backend/src/users/users";
import { TeamInvitation, db } from "~db";
import { DEFAULT_NOTIFICATION_EMAIL, sendEmail } from "~shared/email";
import { log } from "~shared/logger";

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

  const link = `${process.env.FRONTEND_URL}/invites/${invite.token}`;

  const inviterName = getNormalizedUserName(inviter);
  await sendEmail({
    from: DEFAULT_NOTIFICATION_EMAIL,
    to: email,
    subject: `${inviterName} has invited you to collaborate on ${roomInvitation?.room?.name ?? team.name}`,
    html: [
      "Hey!",
      `${inviterName} has invited you to ${roomInvitation?.room ? `collaborate on ${link} room and ` : ""}join ${
        team.name
      } team on Acapela.`,
      `Follow this link to sign up and join the discussion: ${link}`,
    ].join("<br>"),
  });

  log.info("Sent invite notification", {
    userId,
    teamId,
  });
};
