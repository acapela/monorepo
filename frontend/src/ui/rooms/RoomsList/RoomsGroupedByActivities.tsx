import styled from "styled-components";
import { RoomsQueryVariables } from "~gql";
import { groupByFilter } from "~shared/groupByFilter";
import { RoomsListCategory } from "./RoomsListCategory";
import { RoomWithActivity, useRoomsWithActivity } from "./useRoomsWithActivity";

interface Props {
  className?: string;
  query: RoomsQueryVariables;
}

export const RoomsGroupedByActivities = styled(function FilteredRoomsList({ className, query }: Props) {
  const roomsWithActivity = useRoomsWithActivity({ query });

  const [roomsWithNewActivity, roomsWithoutNewActivity] = groupByFilter<RoomWithActivity>(
    roomsWithActivity,
    ({ unreadMessages }) => unreadMessages > 0
  );

  return (
    <UIHolder className={className}>
      {roomsWithNewActivity.length > 0 && (
        <RoomsListCategory categoryName="Rooms with updates" rooms={roomsWithNewActivity} />
      )}
      {roomsWithoutNewActivity.length > 0 && (
        <RoomsListCategory categoryName="Already seen" rooms={roomsWithoutNewActivity} />
      )}
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 64px;
`;
