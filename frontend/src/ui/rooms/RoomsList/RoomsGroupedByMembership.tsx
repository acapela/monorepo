import styled from "styled-components";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";

import { RoomDetailedInfoFragment } from "~gql";
import { groupByFilter } from "~shared/groupByFilter";
import { RoomsListCategory } from "./RoomsListCategory";

interface Props {
  className?: string;
  rooms: RoomDetailedInfoFragment[];
}

export const RoomsGroupedByMembership = styled(function FilteredRoomsList({ className, rooms }: Props) {
  const user = useAssertCurrentUser();

  const [joinedRooms, notJoinedRooms] = groupByFilter<RoomDetailedInfoFragment>(rooms, (room) => {
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
