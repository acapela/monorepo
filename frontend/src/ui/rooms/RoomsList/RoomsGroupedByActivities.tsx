import styled from "styled-components";
import { RoomsQueryVariables } from "~gql";
import { groupByFilter } from "~shared/groupByFilter";
import { RoomsListCategory } from "./RoomsListCategory";
import { RoomWithActivities, useRoomsWithActivities } from "./useRoomsWithActivities";

interface Props {
  className?: string;
  query: RoomsQueryVariables;
}

export const RoomsGroupedByActivities = styled(function FilteredRoomsList({ className, query }: Props) {
  const roomsWithActivities = useRoomsWithActivities({ query });

  const [roomsWithNewActivities, roomsWithAlreadySeenActivities] = groupByFilter<RoomWithActivities>(
    roomsWithActivities,
    ({ unreadMessages }) => unreadMessages > 0
  );

  return (
    <UIHolder className={className}>
      {roomsWithNewActivities.length > 0 && (
        <RoomsListCategory categoryName="Rooms with updates" rooms={roomsWithNewActivities.map((info) => info.room)} />
      )}
      {roomsWithAlreadySeenActivities.length > 0 && (
        <RoomsListCategory
          categoryName="Already seen"
          rooms={roomsWithAlreadySeenActivities.map((info) => info.room)}
        />
      )}
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 64px;
`;
