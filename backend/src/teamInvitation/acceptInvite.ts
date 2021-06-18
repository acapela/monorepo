import { validate as validateUuid } from "uuid";
import { TeamInvitation, db, Team } from "~db";
import { ActionHandler } from "../actions/actionHandlers";
import { AuthenticationError, NotFoundError, UnprocessableEntityError } from "../errors/errorTypes";
import { getHasTeamMember } from "../teams/helpers";
import { findInviteByCode, invalidateInvite } from "./invites";

// Transactional
export async function acceptTeamInvitation(invite: TeamInvitation, userId: string): Promise<Team> {
  /**
   * Make sure the invitation email is matching user email.
   *
   * TODO: I'm not sure it's correct product/ux wise. Eg I invite you to your personal email, but you want to accept it
   * using your work google account.
   */

  const user = await db.user.findFirst({ where: { id: userId, email: invite.email } });

  if (!user) {
    throw new Error(`There is no team invitation matching this user email.`);
  }

  const team = await db.team.update({
    where: {
      id: invite.team_id,
    },
    data: {
      team_invitation: {
        update: {
          where: {
            id: invite.id,
          },
          data: {
            used_at: new Date(),
            used_by_user_id: userId,
          },
        },
      },
      team_member: {
        create: {
          user_id: userId,
        },
      },
    },
  });

  // If user is accepting team invite - set it as current team for this user
  await db.user.update({ where: { id: userId }, data: { current_team_id: team.id } });

  return team;
}

export interface AcceptInviteActionInputs {
  token: string;
}

export const acceptInvite: ActionHandler<
  AcceptInviteActionInputs,
  {
    team_id: string;
    invite_id: string;
  }
> = {
  actionName: "accept_invite",

  async handle(userId, { token }) {
    if (!userId) {
      throw new AuthenticationError("No user id provided with a hasura action");
    }

    if (!validateUuid(token)) {
      throw new UnprocessableEntityError("Malformed invite code");
    }

    const invite = await findInviteByCode(token);

    if (!invite) {
      throw new NotFoundError(`Invite not found for token: ${token}`);
    }

    if (invite.inviting_user_id === userId) {
      return {
        team_id: invite.team_id,
        invite_id: invite.id,
      };
    }

    if (invite.used_at) {
      throw new UnprocessableEntityError(`The invite for token ${token} has already been used`);
    }

    if (await getHasTeamMember(invite.team_id, userId)) {
      await invalidateInvite(invite.id);

      return {
        team_id: invite.team_id,
        invite_id: invite.id,
      };
    }

    await acceptTeamInvitation(invite, userId);

    return {
      team_id: invite.team_id,
      invite_id: invite.id,
    };
  },
};
