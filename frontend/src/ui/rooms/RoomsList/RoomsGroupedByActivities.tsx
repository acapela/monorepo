import styled from "styled-components";
import { useTeamRoomsMessagesCount } from "~frontend/utils/unreadMessages";
import { RoomDetailedInfoFragment } from "~gql";
import { groupByFilter } from "~shared/groupByFilter";
import { RoomsListCategory } from "./RoomsListCategory";

interface Props {
  className?: string;
  rooms: RoomDetailedInfoFragment[];
}

export const RoomsGroupedByActivities = styled(function FilteredRoomsList({ className, rooms }: Props) {
  const roomUnreadMessages = useTeamRoomsMessagesCount();

  const [roomsWithNewActivities, roomsWithAlreadySeenActivities] = groupByFilter<RoomDetailedInfoFragment>(
    rooms,
    (room) => roomUnreadMessages[room.id] > 0
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
