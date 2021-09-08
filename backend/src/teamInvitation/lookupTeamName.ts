import { validate as validateUuid } from "uuid";

import { getNormalizedUserName } from "~backend/src/users/users";
import { db } from "~db";

import { ActionHandler } from "../actions/actionHandlers";
import { NotFoundError, UnprocessableEntityError } from "../errors/errorTypes";

export interface LookupTeamNameActionInputs {
  token: string;
}

export const lookupTeamName: ActionHandler<
  LookupTeamNameActionInputs,
  {
    team_name: string;
    inviter_name: string;
  }
> = {
  actionName: "lookup_team_name",

  async handle(userId, { token }) {
    if (!validateUuid(token)) {
      throw new UnprocessableEntityError("malformed invite code");
    }

    const teamInvitation = await db.team_invitation.findFirst({
      where: {
        token,
        used_by_user_id: null,
      },
      include: {
        team: true,
        user_team_invitation_inviting_user_idTouser: true,
      },
    });

    if (!teamInvitation) {
      throw new NotFoundError("invalid invite token");
    }

    return {
      team_name: teamInvitation.team.name,
      inviter_name: getNormalizedUserName(teamInvitation.user_team_invitation_inviting_user_idTouser),
      email: teamInvitation.email,
    };
  },
};
