import { ActionHandler } from "~backend/src/actions/actionHandlers";
import { sendNotificationIgnoringPreference } from "~backend/src/notifications/sendNotification";
import { createSlackLink } from "~backend/src/slack/md/utils";
import { getSlackUserMentionOrLabel } from "~backend/src/slack/utils";
import { Account, Team, User, db } from "~db";
import { assert } from "~shared/assert";
import { trackBackendUserEvent } from "~shared/backendAnalytics";
import { log } from "~shared/logger";
import { routes } from "~shared/routes";

import { getInviteURL } from "./utils";

export async function sendInviteNotification(user: User, team: Team, inviter: User, hasUserSignedUp: boolean) {
  const inviteUrl = hasUserSignedUp
    ? `${process.env.FRONTEND_URL}${routes.teamSelect}`
    : getInviteURL(user.id, { teamId: team.id, invitingUserId: inviter.id });
  const slackFrom = await getSlackUserMentionOrLabel(inviter, team.id);
  await sendNotificationIgnoringPreference(user, team.id, {
    email: {
      transactionalMessageId: 2,
      messageData: {
        inviter: inviter.name,
        inviteUrl,
        team: team.name,
      },
    },
    slack: `${slackFrom} ${createSlackLink(inviteUrl, `has invited you to join team "${team.name}" on Acapela`)}`,
  });
}

export async function handleInviteNotifications(
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

  const hasUserSignedUp = user.account.length > 0;
  await sendInviteNotification(user, team, inviter, hasUserSignedUp);

  log.info("Sent invite notification", { userId: user.id, teamId });
}

export const inviteUser: ActionHandler<{ input: { email: string; team_id: string } }, { success: boolean }> = {
  actionName: "invite_user",

  async handle(invitingUserId, { input: { email, team_id } }) {
    if (!invitingUserId) {
      return { success: false };
    }

    email = email.toLowerCase().trim();

    let teamMember = await db.team_member.findFirst({
      where: { team_id, user: { email } },
      include: { user: { include: { account: true } } },
    });

    const firstInvite = !teamMember;
    if (firstInvite) {
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

    if (firstInvite) {
      trackBackendUserEvent(invitingUserId, "Invite Sent", { teamId: team_id, inviteEmail: email });
    } else {
      trackBackendUserEvent(invitingUserId, "Resent Team Invitation", { teamId: team_id, userEmail: email });
    }

    await handleInviteNotifications(teamMember.user, team_id, invitingUserId);

    return {
      success: true,
    };
  },
};
