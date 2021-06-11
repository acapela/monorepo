import { MembersManager } from "../MembersManager";
import { useAddRoomMember, useRemoveRoomMember } from "~frontend/gql/rooms";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { assertGet } from "~shared/assert";
import { RoomDetailedInfoFragment } from "~frontend/gql";

interface Props {
  room: RoomDetailedInfoFragment;
  onCurrentUserLeave?: () => void;
}

export const ManageRoomMembers = ({ room, onCurrentUserLeave }: Props) => {
  const currentUser = useCurrentUser();
  const members = room.members.map((m) => m.user);

  const [addRoomMember] = useAddRoomMember();
  const [removeRoomMember] = useRemoveRoomMember();

  async function handleJoin(userId: string) {
    await addRoomMember({ userId, roomId: room.id });
  }

  async function handleLeave(userId: string) {
    const safeCurrentUser = assertGet(currentUser, "user required");
    await removeRoomMember({ userId, roomId: room.id });
    if (onCurrentUserLeave && userId === safeCurrentUser.id) {
      onCurrentUserLeave();
    }
  }

  return <MembersManager users={members} onAddMemberRequest={handleJoin} onLeaveRequest={handleLeave} />;
};
