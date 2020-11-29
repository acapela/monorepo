import { validate as validateUuid } from "uuid";
import { ActionHandler } from "../actions/actionHandlers";
import { findInviteByCode, markInviteAsUsed } from "./invites";
import { getIfParticipantExists, addParticipant } from "../rooms/rooms";
import { NotFoundError, UnprocessableEntityError } from "../errors";
import database from "../database";

export interface AcceptInviteActionInputs {
  code: string;
}

export const acceptInvite: ActionHandler<
  AcceptInviteActionInputs,
  {
    room_id: string;
    invite_id: string;
  }
> = {
  actionName: "accept_invite",

  async handle(userId, { code }) {
    if (!validateUuid(code)) {
      throw new UnprocessableEntityError("Malformed invite code");
    }
    const invite = await findInviteByCode(code);
    if (!invite) {
      throw new NotFoundError(`Invite not found for code: ${code}`);
    }
    if (invite.usedAt) {
      throw new UnprocessableEntityError(`The invite for code ${code} has already been used`);
    }
    const participantAlreadyExists = await getIfParticipantExists(invite.roomId, userId);
    if (participantAlreadyExists) {
      throw new UnprocessableEntityError(`The user ${userId} is already a participant in room ${invite.roomId}`);
    }
    await database.transaction((transaction) =>
      Promise.all([addParticipant(invite.roomId, userId, transaction), markInviteAsUsed(invite, transaction)])
    );

    return {
      room_id: invite.roomId,
      invite_id: invite.id,
    };
  },
};
