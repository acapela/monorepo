import styled from "styled-components";
import { hoverActionCss } from "~ui/transitions";
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
  className?: string;
}

export const RoomCard = styled(function RoomCard({ room, className }: Props) {
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
    <UIHolder onClick={handleOpen} className={className}>
      <ItemTitle>{room.name}</ItemTitle>
      <SecondaryText>{pluralize(topicsCount, "topic", "topics")}</SecondaryText>
      <MembersManager users={members} onAddMemberRequest={handleJoin} onLeaveRequest={handleLeave} />
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  cursor: pointer;

  ${ItemTitle} {
    margin-bottom: 0.5rem;
  }

  ${MembersManager} {
    margin-top: 0.5rem;
  }

  padding: 1rem;
  margin: -1rem;

  ${hoverActionCss}
`;
