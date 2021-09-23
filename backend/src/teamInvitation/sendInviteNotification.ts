import { UnprocessableEntityError } from "~backend/src/errors/errorTypes";
import { slackClient } from "~backend/src/slack/app";
import { fetchTeamBotToken, findSlackUserId } from "~backend/src/slack/utils";
import { findTeamById } from "~backend/src/teams/helpers";
import { findUserById, getNormalizedUserName } from "~backend/src/users/users";
import { TeamInvitation, db } from "~db";
import { assert } from "~shared/assert";
import { DEFAULT_NOTIFICATION_EMAIL, sendEmail } from "~shared/email";
import { log } from "~shared/logger";

export const sendInviteNotification = async (invite: TeamInvitation, userId: string | null) => {
  const { slack_user_id, email, inviting_user_id: invitingUserId, team_id: teamId } = invite;

  const inviteURL = `${process.env.FRONTEND_URL}/invites/${invite.token}`;
  const inviter = await findUserById(invitingUserId);
  assert(inviter, new UnprocessableEntityError(`Inviter ${invitingUserId} does not exist`));

  if (slack_user_id) {
    const [botToken, invitingUserSlackId] = await Promise.all([
      fetchTeamBotToken(teamId),
      findSlackUserId(teamId, inviter),
    ]);
    assert(
      invitingUserSlackId,
      new UnprocessableEntityError(`Inviting user ${invitingUserId} through Slack does not have a Slack id`)
    );
    await slackClient.chat.postMessage({
      token: botToken,
      channel: invitingUserSlackId || slack_user_id, //TODO should be the latter
      text: `<@${invitingUserSlackId}> has invited you to join Acapela: ${inviteURL}`,
    });
    return;
  }

  const team = await findTeamById(teamId);

  assert(team, new UnprocessableEntityError(`Team ${teamId} does not exist`));

  if (!email) {
    return;
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

  if (!roomInvitation) {
    return;
  }

  const inviterName = getNormalizedUserName(inviter);
  await sendEmail({
    from: DEFAULT_NOTIFICATION_EMAIL,
    to: email,
    subject: `${inviterName} has invited you to collaborate on ${roomInvitation.room?.name ?? team.name}`,
    html: [
      "Hey!",
      `${inviterName} has invited you to ${roomInvitation.room ? `collaborate on ${inviteURL} room and ` : ""}join ${
        team.name
      } team on Acapela.`,
      `Follow this link to sign up and join the discussion: ${inviteURL}`,
    ].join("<br>"),
  });

  log.info("Sent invite notification", {
    userId,
    teamId,
  });
};
