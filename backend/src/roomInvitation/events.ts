import { RoomMember } from "~db";
import { RoomInvitation } from "~db";
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

export async function handleRoomInvitationCreated(invite: RoomInvitation, userId: string | null) {
  const { team_id: teamId, inviting_user_id: invitingUserId } = invite;

  // if (userId !== invitingUserId) {
  //   throw new UnprocessableEntityError(
  //     `Inviter id: ${invitingUserId} does not match user making the modification: ${userId}`
  //   );
  // }

  // const [team, inviter] = await Promise.all([findTeamById(teamId), findUserById(invitingUserId)]);

  // if (!team || !inviter) {
  //   throw new UnprocessableEntityError(`Team ${teamId} or inviter ${invitingUserId} does not exist`);
  // }

  // const notification = new TeamInvitationNotification({
  //   recipientEmail: invite.email,
  //   roomName: team.name || "an acapela discussion",
  //   inviterName: getNormalizedUserName(inviter),
  //   inviteCode: invite.token,
  // });

  // await sendNotification(notification);

  // logger.info("Sent invite notification", {
  //   userId,
  //   teamId,
  // });
}
