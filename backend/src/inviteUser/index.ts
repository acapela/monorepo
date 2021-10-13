import { ActionHandler } from "~backend/src/actions/actionHandlers";
import { UnprocessableEntityError } from "~backend/src/errors/errorTypes";
import { slackClient } from "~backend/src/slack/app";
import { fetchTeamBotToken, findSlackUserId } from "~backend/src/slack/utils";
import { findTeamById } from "~backend/src/teams/helpers";
import { User, db } from "~db";
import { assert } from "~shared/assert";
import { DEFAULT_NOTIFICATION_EMAIL, sendEmail } from "~shared/email";
import { enrichPayload, signJWT } from "~shared/jwt";
import { log } from "~shared/logger";

function getUserNameWithFallbacks(user: User): string {
  if (user.name) {
    return user.name;
  }
  if (user.email) {
    return user.email;
  }
  return "Your colleague";
}

async function sendInvitationSlackMessage(teamId: string, inviter: User, slackUserId: string, inviteURL: string) {
  const [botToken, invitingUserSlackId] = await Promise.all([
    fetchTeamBotToken(teamId),
    findSlackUserId(teamId, inviter),
  ]);
  const inviterName = invitingUserSlackId ? `<@${invitingUserSlackId}>` : "A colleague";
  await slackClient.chat.postMessage({
    token: botToken,
    channel: slackUserId,
    text: `${inviterName} <${inviteURL}|has invited you to join Acapela>`,
  });
}

async function sendInvitationEmail(teamId: string, email: string, inviter: User, inviteURL: string) {
  const team = await findTeamById(teamId);

  assert(team, new UnprocessableEntityError(`Team ${teamId} does not exist`));

  const inviterName = getUserNameWithFallbacks(inviter);
  await sendEmail({
    from: DEFAULT_NOTIFICATION_EMAIL,
    to: email,
    subject: `${inviterName} has invited you to collaborate on ${team.name}`,
    html: [
      "Hey!",
      `${inviterName} has invited you to join ${team.name} team on Acapela.`,
      `Follow <a href="${inviteURL}">this link</a> to sign up and join the discussion.`,
    ].join("<br>"),
  });
}

export const sendInviteNotification = async (user: User, teamId: string, invitingUserId: string) => {
  const inviteURL = `${process.env.FRONTEND_URL}/invite?${new URLSearchParams(
    Object.entries({
      jwt: signJWT(enrichPayload({ userId: user.id, teamId })),
      teamId,
      invitingUserId,
    })
  )}`;
  const invitingUser = await db.user.findUnique({ where: { id: invitingUserId } });
  assert(invitingUser, new UnprocessableEntityError(`Inviter ${invitingUserId} does not exist`));

  const teamMemberSlack = await db.team_member_slack.findFirst({
    where: { team_member: { team_id: teamId, user_id: user.id } },
  });

  if (teamMemberSlack) {
    await sendInvitationSlackMessage(teamId, invitingUser, teamMemberSlack.slack_user_id, inviteURL);
  } else if (user.email) {
    await sendInvitationEmail(teamId, user.email, invitingUser, inviteURL);
  } else {
    return;
  }

  log.info("Sent invite notification", {
    userId: user.id,
    teamId,
  });
};

export const inviteUser: ActionHandler<{ input: { email: string; team_id: string } }, { success: boolean }> = {
  actionName: "invite_user",

  async handle(invitingUserId, { input: { email, team_id } }) {
    const findUserByEmailAndTeamId = () =>
      db.user.findFirst({ where: { email, team_member: { some: { team_id } } }, include: { account: true } });

    let user = await findUserByEmailAndTeamId();
    const hasAlreadyAcceptedInvitation = (user?.account.length || 0) > 0;
    if (hasAlreadyAcceptedInvitation || !invitingUserId) {
      return { success: false };
    }

    if (!user) {
      await db.team_member.create({
        data: {
          user: { connectOrCreate: { where: { email }, create: { email, current_team_id: team_id } } },
          team: { connect: { id: team_id } },
        },
      });
      user = await findUserByEmailAndTeamId();
    }

    assert(user, "user must have been created");

    await sendInviteNotification(user, team_id, invitingUserId);

    return {
      success: true,
    };
  },
};
