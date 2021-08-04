import { db, RoomMember } from "~db";
import { RoomInvitation } from "~db";
import { UnprocessableEntityError } from "~backend/src/errors/errorTypes";
import { HasuraEvent } from "../hasura";
import { createNotification } from "../notifications/entity";
import { findRoomById } from "~backend/src/rooms/rooms";
import { findUserById } from "~backend/src/users/users";

export async function handleRoomMemberCreated({ item: invite, userId }: HasuraEvent<RoomMember>) {
  const { room_id: roomId, user_id: addedUserId } = invite;

  if (userId === addedUserId) {
    // user added themselves
    return;
  }

  if (!userId) {
    throw new UnprocessableEntityError("user id missing");
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

  // if someone gets invited to a room, he automatically gets invited to the team also
  await db.team_invitation.upsert({
    where: {
      team_invitation_team_id_email_key: {
        email,
        team_id: teamId,
      },
    },
    create: {
      email,
      team_id: teamId,
      inviting_user_id: invitingUserId,
    },
    update: {},
  });
}
