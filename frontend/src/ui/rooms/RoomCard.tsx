import styled from "styled-components";
import { ItemTitle, SecondaryText } from "~ui/typo";
import { RoomDetailedInfoFragment } from "~frontend/gql";
import { routes } from "~frontend/routes";
import { pluralize } from "~shared/numbers";
import { AvatarList } from "../AvatarList";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { Button } from "~ui/button";
import { useAddRoomMember, useRemoveRoomMember } from "~frontend/gql/rooms";
import { assert } from "~shared/assert";

interface Props {
  room: RoomDetailedInfoFragment;
}

export function RoomCard({ room }: Props) {
  const user = useCurrentUser();
  const [addRoomMember] = useAddRoomMember();
  const [removeRoomMember] = useRemoveRoomMember();
  const topicsCount = room.topics.length;

  const members = room.members.map((m) => m.user);

  const isMember = members.some((member) => member.id === user?.id);

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
    <UIHolder>
      <ItemTitle onClick={handleOpen}>{room.name}</ItemTitle>
      <SecondaryText>{pluralize(topicsCount, "topic", "topics")}</SecondaryText>
      <SecondaryText>{pluralize(members.length, "member", "members")}</SecondaryText>
      <AvatarList users={members} />
      {isMember && <Button onClick={handleLeave}>Leave</Button>}
      {!isMember && <Button onClick={handleJoin}>Join</Button>}
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
