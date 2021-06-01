import { TeamInvitation, User } from "~db";
import logger from "~shared/logger";
import { UnprocessableEntityError } from "../errors";
import { sendNotification } from "../notifications/sendNotification";
import { findTeamById } from "../teams/helpers";
import { findUserById } from "../users/users";
import { TeamInvitationNotification } from "./InviteNotification";

export async function handleTeamInvitationCreated(invite: TeamInvitation, userId: string | null) {
  const { team_id: teamId, inviting_user_id: invitingUserId } = invite;

  if (userId !== invitingUserId) {
    throw new UnprocessableEntityError(
      `Inviter id: ${invitingUserId} does not match user making the modification: ${userId}`
    );
  }

  const [team, inviter] = await Promise.all([findTeamById(teamId), findUserById(invitingUserId)]);

  if (!team || !inviter) {
    throw new UnprocessableEntityError(`Team ${teamId} or inviter ${invitingUserId} does not exist`);
  }

  const notification = new TeamInvitationNotification({
    recipientEmail: invite.email,
    roomName: team.name || "an acapela discussion",
    inviterName: getInviterName(inviter),
    inviteCode: invite.token,
  });

  await sendNotification(notification);

  logger.info("Sent invite notification", {
    userId,
    teamId,
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
