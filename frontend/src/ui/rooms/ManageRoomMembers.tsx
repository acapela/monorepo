import { MembersManager } from "../MembersManager";
import { useAddRoomMember, useRemoveRoomMember } from "~frontend/gql/rooms";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { assert } from "~shared/assert";
import { RoomDetailedInfoFragment } from "~frontend/gql";

interface Props {
  room: RoomDetailedInfoFragment;
  onCurrentUserLeave?: () => void;
}

export const ManageRoomMembers = ({ room, onCurrentUserLeave }: Props) => {
  const user = useCurrentUser();
  const members = room.members.map((m) => m.user);

  const [addRoomMember] = useAddRoomMember();
  const [removeRoomMember] = useRemoveRoomMember();

  async function handleJoin(userId: string) {
    assert(user, "user required");
    await addRoomMember({ userId, roomId: room.id });
  }

  async function handleLeave() {
    assert(user, "user required");
    await removeRoomMember({ userId: user.id, roomId: room.id });
    if (onCurrentUserLeave) {
      onCurrentUserLeave();
    }
  }

  return <MembersManager users={members} onAddMemberRequest={handleJoin} onLeaveRequest={handleLeave} />;
};
