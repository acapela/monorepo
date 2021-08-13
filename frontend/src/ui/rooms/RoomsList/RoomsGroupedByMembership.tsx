import styled from "styled-components";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { RoomsQueryVariables } from "~gql";
import { groupByFilter } from "~shared/groupByFilter";
import { RoomsListCategory } from "./RoomsListCategory";
import { RoomWithActivity, useRoomsWithActivity } from "./useRoomsWithActivity";

interface Props {
  className?: string;
  query: RoomsQueryVariables;
}

export const RoomsGroupedByMembership = styled(function FilteredRoomsList({ className, query }: Props) {
  const user = useAssertCurrentUser();

  const roomsWithNewActivity = useRoomsWithActivity({ query });

  const [joinedRooms, notJoinedRooms] = groupByFilter<RoomWithActivity>(roomsWithNewActivity, ({ room }) => {
    return room.members.some((member) => member.user.id === user.id);
  });

  return (
    <UIHolder className={className}>
      {joinedRooms.length > 0 && <RoomsListCategory categoryName="Joined Rooms" rooms={joinedRooms} showClosedToggle />}
      {notJoinedRooms.length > 0 && (
        <RoomsListCategory categoryName="Other Rooms" rooms={notJoinedRooms} showClosedToggle />
      )}
    </UIHolder>
  );
})``;

const UIHolder = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 64px;
`;
