import { UnprocessableEntityError } from "~backend/src/errors/errorTypes";
import { slackClient } from "~backend/src/slack/app";
import { fetchTeamBotToken, findSlackUserId } from "~backend/src/slack/utils";
import { findTeamById } from "~backend/src/teams/helpers";
import { findUserById, getNormalizedUserName } from "~backend/src/users/users";
import { TeamInvitation, User, db } from "~db";
import { assert } from "~shared/assert";
import { DEFAULT_NOTIFICATION_EMAIL, sendEmail } from "~shared/email";
import { log } from "~shared/logger";

async function sendSlackInvitation(teamId: string, inviter: User, slackUserId: string, inviteURL: string) {
  const [botToken, invitingUserSlackId] = await Promise.all([
    fetchTeamBotToken(teamId),
    findSlackUserId(teamId, inviter),
  ]);
  const inviterName = invitingUserSlackId ? `<@${invitingUserSlackId}>` : "A colleague";
  await slackClient.chat.postMessage({
    token: botToken,
    channel: slackUserId,
    text: `${inviterName} has invited you to join Acapela: ${inviteURL}`,
  });
}

async function sendEmailInvitation(teamId: string, email: string, inviter: User, inviteURL: string) {
  const team = await findTeamById(teamId);

  assert(team, new UnprocessableEntityError(`Team ${teamId} does not exist`));

  const roomInvitation = await db.room_invitation.findFirst({
    where: { email, team_id: teamId },
    include: { room: true },
  });

  const inviterName = getNormalizedUserName(inviter);
  const roomName = roomInvitation?.room?.name;
  await sendEmail({
    from: DEFAULT_NOTIFICATION_EMAIL,
    to: email,
    subject: `${inviterName} has invited you to collaborate on ${roomName ?? team.name}`,
    html: [
      "Hey!",
      `${inviterName} has invited you to ${roomName ? `collaborate on ${roomName} room and ` : ""}join ${
        team.name
      } team on Acapela.`,
      `Follow this link to sign up and join the discussion: ${inviteURL}`,
    ].join("<br>"),
  });
}

export const sendInviteNotification = async (invite: TeamInvitation, userId: string | null) => {
  const { slack_user_id, email, inviting_user_id: invitingUserId, team_id: teamId } = invite;

  const inviteURL = `${process.env.FRONTEND_URL}/invites/${invite.token}`;
  const inviter = await findUserById(invitingUserId);
  assert(inviter, new UnprocessableEntityError(`Inviter ${invitingUserId} does not exist`));

  if (slack_user_id) {
    await sendSlackInvitation(teamId, inviter, slack_user_id, inviteURL);
  } else if (email) {
    await sendEmailInvitation(teamId, email, inviter, inviteURL);
  } else {
    return;
  }

  log.info("Sent invite notification", {
    userId,
    teamId,
  });
};
