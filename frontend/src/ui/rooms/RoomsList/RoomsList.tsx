import styled from "styled-components";
import { CollapsibleRoomInfo } from "./CollapsibleRoomInfo";
import { RoomWithActivities } from "./useRoomsWithActivities";

interface Props {
  className?: string;
  rooms: RoomWithActivities[];
}

export const RoomsList = styled(function RoomsList({ className, rooms }: Props) {
  return (
    <UIHolder className={className}>
      {rooms.map(({ room, unreadMessages }) => (
        <UICollapsibleRoomInfo key={room.id} room={room} topics={room.topics} unreadMessages={unreadMessages} />
      ))}
    </UIHolder>
  );
})``;

const UIHolder = styled.div<{}>``;

const UICollapsibleRoomInfo = styled(CollapsibleRoomInfo)<{}>`
  margin-bottom: 16px;
`;
