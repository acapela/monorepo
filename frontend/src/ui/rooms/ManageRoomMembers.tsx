import { MembersManager } from "../MembersManager";
import { useAddRoomMember, useRemoveRoomMember } from "~frontend/gql/rooms";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { assert } from "~shared/assert";
import { RoomDetailedInfoFragment } from "~frontend/gql";

interface Props {
  room: RoomDetailedInfoFragment;
}

export const ManageRoomMembers = ({ room }: Props) => {
  const user = useCurrentUser();
  const members = room.members.map((m) => m.user);

  const [addRoomMember] = useAddRoomMember();
  const [removeRoomMember] = useRemoveRoomMember();

  async function handleJoin() {
    assert(user, "user required");
    await addRoomMember({ userId: user.id, roomId: room.id });
  }

  async function handleLeave() {
    assert(user, "user required");
    await removeRoomMember({ userId: user.id, roomId: room.id });
  }

  return <MembersManager users={members} onAddMemberRequest={handleJoin} onLeaveRequest={handleLeave} />;
};
