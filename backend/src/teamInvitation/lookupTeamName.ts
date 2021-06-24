import { validate as validateUuid } from "uuid";
import { db } from "~db";
import { ActionHandler } from "../actions/actionHandlers";
import { NotFoundError, UnprocessableEntityError } from "../errors/errorTypes";
import { getInviterName } from "./events";

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
        user: true,
      },
    });

    if (!teamInvitation) {
      throw new NotFoundError("invalid invite token");
    }

    return {
      team_name: teamInvitation.team.name,
      inviter_name: getInviterName(teamInvitation.user),
    };
  },
};
