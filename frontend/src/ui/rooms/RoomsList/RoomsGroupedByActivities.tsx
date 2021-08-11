import styled from "styled-components";
import { RoomDetailedInfoFragment } from "~gql";
import { groupByFilter } from "~shared/groupByFilter";
import { RoomsListCategory } from "./RoomsListCategory";
import { RoomWithActivities, useRoomsWithActivities } from "./useRoomsWithActivities";

interface Props {
  className?: string;
  rooms: RoomDetailedInfoFragment[];
}

export const RoomsGroupedByActivities = styled(function FilteredRoomsList({ className, rooms }: Props) {
  const roomsWithActivities = useRoomsWithActivities(rooms);

  const [roomsWithNewActivities, roomsWithAlreadySeenActivities] = groupByFilter<RoomWithActivities>(
    roomsWithActivities,
    (room) => room.unreadMessages > 0
  );

  return (
    <UIHolder className={className}>
      {roomsWithNewActivities.length > 0 && (
        <RoomsListCategory categoryName="Rooms with updates" rooms={roomsWithNewActivities} />
      )}
      {roomsWithAlreadySeenActivities.length > 0 && (
        <RoomsListCategory categoryName="Already seen" rooms={roomsWithAlreadySeenActivities} />
      )}
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 64px;
`;
