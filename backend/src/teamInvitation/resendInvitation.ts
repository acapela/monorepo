import { db } from "~db";
import { ActionHandler } from "~backend/src/actions/actionHandlers";
import { UnprocessableEntityError } from "~backend/src/errors/errorTypes";
import { assert } from "~shared/assert";
import { sendInviteNotification } from "./sendInviteNotification";

export interface ResendInvitationActionInputs {
  invitation_id: string;
}

export interface ResendInvitationResponse {
  sent_at: Date;
}

export const resendInvitation: ActionHandler<ResendInvitationActionInputs, ResendInvitationResponse> = {
  actionName: "resend_invitation",

  async handle(userId, { invitation_id }) {
    const teamInvitation = await db.team_invitation.findFirst({ where: { id: invitation_id } });
    assert(teamInvitation, new UnprocessableEntityError(`Team invitation ${invitation_id} does not exist`));

    const user = await db.user.findFirst({ where: { id: userId } });
    assert(user, new UnprocessableEntityError(`User ${invitation_id} does not exist`));
    assert(
      user.current_team_id === teamInvitation.team_id,
      `user ${user.id} is not part of team ${teamInvitation.team_id}`
    );

    await sendInviteNotification(teamInvitation, user.id);

    return {
      sent_at: new Date(),
    };
  },
};
