import { UnprocessableEntityError } from "~backend/src/errors/errorTypes";
import { findRoomById } from "~backend/src/rooms/rooms";
import { findUserById } from "~backend/src/users/users";
import { RoomMember, db } from "~db";
import { RoomInvitation } from "~db";

import { HasuraEvent } from "../hasura";
import { createNotification } from "../notifications/entity";

export async function handleRoomMemberCreated({ item: invite, userId }: HasuraEvent<RoomMember>) {
  const { room_id: roomId, user_id: addedUserId } = invite;

  if (!userId || userId === addedUserId) {
    // user added themselves or user added by the backend
    return;
  }

  await createNotification({
    type: "addedToRoom",
    userId: addedUserId,
    payload: { addedByUserId: userId, roomId: roomId },
  });
}

export async function handleRoomInvitationCreated({ item: invite, userId }: HasuraEvent<RoomInvitation>) {
  const { room_id: roomId, inviting_user_id: invitingUserId, team_id: teamId, email } = invite;

  if (userId !== invitingUserId) {
    throw new UnprocessableEntityError(
      `Inviter id: ${invitingUserId} does not match user making the modification: ${userId}`
    );
  }

  const [room, inviter] = await Promise.all([findRoomById(roomId), findUserById(invitingUserId)]);

  if (!room || !inviter) {
    throw new UnprocessableEntityError(`Room ${roomId} or inviter ${invitingUserId} does not exist`);
  }

  const existingTeamInvitation = await db.team_invitation.findFirst({ where: { email, team_id: teamId } });

  if (existingTeamInvitation) {
    return;
  }

  await db.team_invitation.create({ data: { email, team_id: teamId, inviting_user_id: invitingUserId } });
}
