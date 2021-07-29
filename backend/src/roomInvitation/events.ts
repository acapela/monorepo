import { RoomMember } from "~db";
import { UnprocessableEntityError } from "~backend/src/errors/errorTypes";
import { HasuraEvent } from "../hasura";
import { createNotification } from "../notifications/entity";

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
