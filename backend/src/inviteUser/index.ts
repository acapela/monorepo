import { ActionHandler } from "~backend/src/actions/actionHandlers";
import {
  sendNotificationIgnoringPreference,
  sendNotificationPerPreference,
} from "~backend/src/notifications/sendNotification";
import { getSlackUserMentionOrLabel } from "~backend/src/slack/utils";
import { Account, Team, User, db } from "~db";
import { assert } from "~shared/assert";
import { createJWT, signJWT } from "~shared/jwt";
import { log } from "~shared/logger";
import { routes } from "~shared/routes";

async function sendNewUserInviteNotification(user: User, team: Team, inviter: User) {
  const inviteURL = `${process.env.FRONTEND_URL}${routes.invite}?${new URLSearchParams(
    Object.entries({
      jwt: signJWT(createJWT({ userId: user.id })),
      teamId: team.id,
      invitingUserId: inviter.id,
    })
  )}`;
  const slackFrom = await getSlackUserMentionOrLabel(inviter, team.id);
  await sendNotificationIgnoringPreference(user, team.id, {
    email: {
      subject: `${inviter.name} has invited you to collaborate on ${team.name}`,
      html: [
        "Hey!",
        `${inviter.name} has invited you to join ${team.name} team on Acapela.`,
        `Follow <a href="${inviteURL}">this link</a> to sign up and join the discussion.`,
      ].join("<br>"),
    },
    slack: `${slackFrom} <${inviteURL}|has invited you to join team "${team.name}" Acapela>`,
  });
}

async function sendExistingUserInviteNotification(user: User, team: Team, inviter: User) {
  const inviteURL = `${process.env.FRONTEND_URL}${routes.teamSelect}`;
  const slackFrom = await getSlackUserMentionOrLabel(inviter, team.id);
  await sendNotificationPerPreference(user, team.id, {
    email: {
      subject: `${inviter.name} has invited you to collaborate on ${team.name}`,
      html: [
        "Hey!",
        `${inviter.name} has invited you to join ${team.name} team on Acapela.`,
        `Follow <a href="${inviteURL}">this link</a> and select team "${team.name}" to join the discussion.`,
      ].join("<br>"),
    },
    slack: `${slackFrom} <${inviteURL}|has invited you to join team "${team.name}">`,
  });
}

export async function sendInviteNotification(
  user: User & { account: Account[] },
  teamId: string,
  invitingUserId: string
) {
  const [team, inviter] = await Promise.all([
    db.team.findUnique({ where: { id: teamId } }),
    db.user.findUnique({ where: { id: invitingUserId } }),
  ]);
  assert(team, `missing team for ${teamId}`);
  assert(inviter, `Inviter ${invitingUserId} does not exist`);

  if (user.account.length == 0) {
    await sendNewUserInviteNotification(user, team, inviter);
  } else {
    await sendExistingUserInviteNotification(user, team, inviter);
  }

  log.info("Sent invite notification", { userId: user.id, teamId });
}

export const inviteUser: ActionHandler<{ input: { email: string; team_id: string } }, { success: boolean }> = {
  actionName: "invite_user",

  async handle(invitingUserId, { input: { email, team_id } }) {
    if (!invitingUserId) {
      return { success: false };
    }

    let teamMember = await db.team_member.findFirst({
      where: { team_id, user: { email } },
      include: { user: { include: { account: true } } },
    });

    if (!teamMember) {
      teamMember = await db.team_member.create({
        data: {
          user: {
            connectOrCreate: {
              where: { email },
              create: {
                email,
                name: email,
                current_team_id: team_id,
              },
            },
          },
          team: { connect: { id: team_id } },
        },
        include: {
          user: { include: { account: true } },
        },
      });
    }

    assert(teamMember, "teamMember must have been created");

    await sendInviteNotification(teamMember.user, team_id, invitingUserId);

    return {
      success: true,
    };
  },
};
