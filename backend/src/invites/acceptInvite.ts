import { validate as validateUuid } from "uuid";
import { ActionHandler } from "../actions/actionHandlers";
import { findInviteByCode } from "./invites";
import { addRoomParticipantAndInvalidateInvite, getIfParticipantExists } from "../rooms/rooms";
import { NotFoundError, UnprocessableEntityError } from "../errors";

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

    if (invite.inviter_id === userId) {
      return {
        room_id: invite.room_id,
        invite_id: invite.id,
      };
    }

    if (invite.used_at) {
      throw new UnprocessableEntityError(`The invite for code ${code} has already been used`);
    }

    const participantAlreadyExists = await getIfParticipantExists(invite.room_id, userId);

    if (participantAlreadyExists) {
      throw new UnprocessableEntityError(`The user ${userId} is already a participant in room ${invite.room_id}`);
    }

    await addRoomParticipantAndInvalidateInvite(invite, userId);

    return {
      room_id: invite.room_id,
      invite_id: invite.id,
    };
  },
};
