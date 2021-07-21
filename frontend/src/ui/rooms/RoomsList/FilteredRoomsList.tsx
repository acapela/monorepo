import styled from "styled-components";
import { RoomDetailedInfoFragment, RoomsQueryVariables } from "~gql";
import { RoomsList } from "./RoomsList";
import { useRoomsQuery } from "~frontend/gql/rooms";
import { groupByFilter } from "~frontend/../../shared/groupByFilter";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { CategoryNameLabel } from "~frontend/../../ui/theme/functional";

interface Props {
  className?: string;
  query: RoomsQueryVariables;
}

export const FilteredRoomsList = styled(function FilteredRoomsList({ className, query }: Props) {
  const [rooms = []] = useRoomsQuery(query);
  const user = useAssertCurrentUser();

  const [joinedRooms, notJoinedRooms] = groupByFilter<RoomDetailedInfoFragment>(rooms, (room) => {
    return room.members.some((member) => member.user.id === user.id);
  });

  return (
    <UIHolder className={className}>
      {joinedRooms.length > 0 && (
        <UIGroupHolder>
          <CategoryNameLabel>Joined Rooms</CategoryNameLabel>
          <RoomsList rooms={joinedRooms} />
        </UIGroupHolder>
      )}
      {notJoinedRooms.length > 0 && (
        <UIGroupHolder>
          <CategoryNameLabel>Other rooms</CategoryNameLabel>
          <RoomsList rooms={notJoinedRooms} />
        </UIGroupHolder>
      )}
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 64px;
`;
const UIGroupHolder = styled.div`
  ${CategoryNameLabel} {
    margin-bottom: 16px;
  }
`;
