import styled from "styled-components";
import { RoomDetailedInfoFragment, RoomsQueryVariables } from "~gql";
import { useRoomsQuery } from "~frontend/gql/rooms";
import { groupByFilter } from "~shared/groupByFilter";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { RoomsListCategory } from "./RoomsListCategory";

interface Props {
  className?: string;
  query: RoomsQueryVariables;
}

export const RoomsGroupedByMembership = styled(function FilteredRoomsList({ className, query }: Props) {
  const [rooms = []] = useRoomsQuery(query);
  const user = useAssertCurrentUser();

  const [joinedRooms, notJoinedRooms] = groupByFilter<RoomDetailedInfoFragment>(rooms, (room) => {
    return room.members.some((member) => member.user.id === user.id);
  });

  return (
    <UIHolder className={className}>
      {joinedRooms.length > 0 && (
        <RoomsListCategory key="joined-rooms" categoryName="Joined Rooms" rooms={joinedRooms} showClosedToggle />
      )}
      {notJoinedRooms.length > 0 && (
        <RoomsListCategory key="other-rooms" categoryName="Other Rooms" rooms={notJoinedRooms} showClosedToggle />
      )}
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 64px;
`;
