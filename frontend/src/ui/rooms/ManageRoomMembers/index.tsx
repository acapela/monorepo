import { MembersManager } from "../../MembersManager";
import { useAddRoomMemberMutation, isCurrentUserRoomMember, useRemoveRoomMemberMutation } from "~frontend/gql/rooms";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { assertGet } from "~shared/assert";
import { RoomDetailedInfoFragment } from "~gql";
import { openLastPrivateRoomMemberDeletionPrompt } from "./openLastPrivateRoomMemberDeletionPrompt";

interface Props {
  room: RoomDetailedInfoFragment;
  onCurrentUserLeave?: () => void;
}

export const ManageRoomMembers = ({ room, onCurrentUserLeave }: Props) => {
  const currentUser = useCurrentUser();
  const members = room.members.map((m) => m.user);
  const amIMember = isCurrentUserRoomMember(room);

  const [addRoomMember] = useAddRoomMemberMutation();
  const [removeRoomMember] = useRemoveRoomMemberMutation();

  function isLastMemberInRoom() {
    return room.members.length === 1;
  }

  async function handleJoin(userId: string) {
    await addRoomMember({ userId, roomId: room.id });
  }

  async function handleLeave(userId: string) {
    const safeCurrentUser = assertGet(currentUser, "user required");

    if (room.is_private && isLastMemberInRoom()) {
      await openLastPrivateRoomMemberDeletionPrompt({ room });
      return;
    }

    await removeRoomMember({ userId, roomId: room.id });
    if (onCurrentUserLeave && userId === safeCurrentUser.id) {
      onCurrentUserLeave();
    }
  }

  return (
    <MembersManager
      isReadonly={!amIMember}
      users={members}
      onAddMemberRequest={handleJoin}
      onRemoveMemberRequest={handleLeave}
    />
  );
};
