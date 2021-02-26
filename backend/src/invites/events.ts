import { EventHandler } from "../events/eventHandlers";
import { findRoomById } from "../rooms/rooms";
import { findUserById, User } from "../users/users";
import { UnprocessableEntityError } from "../errors";
import logger from "@acapela/shared/logger";
import { InviteNotification } from "./InviteNotification";
import { sendNotification } from "../notifications/sendNotification";

interface Invite {
  id: string;
  email: string;
  code: string;
  room_id: string;
  inviter_id: string;
}

export const handleInviteCreated: EventHandler<Invite> = {
  triggerName: "invite_created",
  handleInsert: async (userId: string, invite: Invite) => {
    const { room_id: roomId, inviter_id: inviterId } = invite;
    if (userId !== inviterId) {
      throw new UnprocessableEntityError(
        `Inviter id: ${inviterId} does not match user making the modification: ${userId}`
      );
    }

    const [room, inviter] = await Promise.all([findRoomById(roomId), findUserById(inviterId)]);
    if (!room || !inviter) {
      throw new UnprocessableEntityError(`Room ${roomId} or inviter ${inviterId} does not exist`);
    }

    const notification = new InviteNotification({
      recipientEmail: invite.email,
      roomName: room.name || "an acapela discussion",
      inviterName: getInviterName(inviter),
      inviteCode: invite.code,
    });
    await sendNotification(notification);
    logger.info("Sent invite notification", {
      userId,
      roomId,
    });
  },
};

function getInviterName(inviter: User): string {
  if (inviter.name) {
    return firstName(inviter.name);
  }
  if (inviter.email) {
    return inviter.email;
  }
  return "Your colleague";
}

function firstName(name: string): string {
  return name.trim().split(" ")[0];
}
