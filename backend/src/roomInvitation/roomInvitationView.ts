import { validate as validateUuid } from "uuid";

import { ActionHandler } from "~backend/src/actions/actionHandlers";
import { NotFoundError, UnprocessableEntityError } from "~backend/src/errors/errorTypes";
import { getNormalizedUserName } from "~backend/src/users/users";
import { db } from "~db";

export interface RoomInvitationViewActionInputs {
  token: string;
}

export interface RoomInvitationViewResponse {
  room_name: string;
  inviter_name: string;
}

export const roomInvitationView: ActionHandler<RoomInvitationViewActionInputs, RoomInvitationViewResponse> = {
  actionName: "room_invitation_view",

  async handle(userId, { token }) {
    if (!validateUuid(token)) {
      throw new UnprocessableEntityError("malformed invite code");
    }

    const roomInvitation = await db.room_invitation.findFirst({
      where: {
        token,
        used_by_user_id: null,
      },
      include: {
        room: true,
        user_room_invitation_inviting_user_idTouser: true,
      },
    });

    if (!roomInvitation) {
      throw new NotFoundError("invalid invite token");
    }

    return {
      room_name: roomInvitation.room.name,
      inviter_name: getNormalizedUserName(roomInvitation.user_room_invitation_inviting_user_idTouser),
    };
  },
};
