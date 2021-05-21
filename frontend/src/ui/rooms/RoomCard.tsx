import styled from "styled-components";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { RoomDetailedInfoFragment } from "~frontend/gql";
import { useAddRoomMember, useRemoveRoomMember } from "~frontend/gql/rooms";
import { routes } from "~frontend/routes";
import { assert } from "~shared/assert";
import { pluralize } from "~shared/numbers";
import { ItemTitle, SecondaryText } from "~ui/typo";
import { MembersManager } from "../MembersManager";

interface Props {
  room: RoomDetailedInfoFragment;
}

export function RoomCard({ room }: Props) {
  const user = useCurrentUser();
  const [addRoomMember] = useAddRoomMember();
  const [removeRoomMember] = useRemoveRoomMember();
  const topicsCount = room.topics.length;

  const members = room.members.map((m) => m.user);

  async function handleJoin() {
    assert(user, "user required");
    await addRoomMember({ userId: user.id, roomId: room.id });
  }

  async function handleLeave() {
    assert(user, "user required");
    await removeRoomMember({ userId: user.id, roomId: room.id });
  }

  function handleOpen() {
    routes.spaceRoom.push({ roomId: room.id, spaceId: room.space_id });
  }

  return (
    <UIHolder onClick={handleOpen}>
      <ItemTitle>{room.name}</ItemTitle>
      <SecondaryText>{pluralize(topicsCount, "topic", "topics")}</SecondaryText>
      <SecondaryText>{pluralize(members.length, "member", "members")}</SecondaryText>
      <MembersManager users={members} onAddMemberRequest={handleJoin} onLeaveRequest={handleLeave} />
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 21px 14px;

  /* Base/White */

  background: #ffffff;
  /* Borders/Default */

  border: 1px solid #ededed;
  /* Card/Default */

  box-shadow: 0px 0px 8px 4px rgba(43, 42, 53, 0.03);
  border-radius: 16px;
`;
