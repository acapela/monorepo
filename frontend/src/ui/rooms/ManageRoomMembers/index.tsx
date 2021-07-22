import { flipExecutionOrder } from "~shared/array";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { addRoomMember, removeRoomMember } from "~frontend/gql/rooms";
import { MembersManager } from "~frontend/ui/MembersManager";
import { RoomDetailedInfoFragment, UserBasicInfoFragment } from "~gql";
import { openLastPrivateRoomMemberDeletionPrompt } from "./openLastPrivateRoomMemberDeletionPrompt";

interface Props {
  room: RoomDetailedInfoFragment;
  onCurrentUserLeave?: () => Promise<void>;
}

export const RoomMembers = ({ room, onCurrentUserLeave }: Props) => {
  const currentUser = useAssertCurrentUser();
  const members = room.members.map((m) => m.user);

  async function handleAddMember(userId: string) {
    await addMember(userId, room.id);
  }

  async function handleRemoveMember(userId: string) {
    if (userId === currentUser.id) {
      await removeCurrentUser(currentUser, room, onCurrentUserLeave);
    } else {
      await removeMember(userId, room);
    }
  }

  return (
    <MembersManager users={members} onAddMemberRequest={handleAddMember} onRemoveMemberRequest={handleRemoveMember} />
  );
};

export function isLastMember(room: RoomDetailedInfoFragment) {
  return room.members.length === 1;
}

export async function addMember(userId: string, roomId: string) {
  await addRoomMember({ userId, roomId });
}

export async function removeMember(userId: string, room: RoomDetailedInfoFragment) {
  await removeRoomMember({ userId, roomId: room.id });
}

export async function removeCurrentUser(
  currentUser: UserBasicInfoFragment,
  room: RoomDetailedInfoFragment,
  onCurrentUserLeave?: () => Promise<void>
) {
  if (room.is_private && isLastMember(room)) {
    await openLastPrivateRoomMemberDeletionPrompt({ room });
    return;
  }

  const leaveRoom = () => removeMember(currentUser.id, room);

  // Works for routing out of the room when leaving it
  // This is done before as to prevent "This is a private room" warning from popping up
  // Since routing is pretty slow, we only want to route before leaving the room when the room is private
  if (onCurrentUserLeave) {
    const canKeepSameExecutionOrder = room.is_private;
    const results = flipExecutionOrder([onCurrentUserLeave, leaveRoom], canKeepSameExecutionOrder);
    await Promise.all(results);
  } else {
    await leaveRoom();
  }
}
