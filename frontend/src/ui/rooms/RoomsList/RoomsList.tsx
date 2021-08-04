import styled from "styled-components";
import { RoomDetailedInfoFragment } from "~frontend/../../gql";
import { CollapsibleRoomInfo } from "./CollapsibleRoomInfo";

interface Props {
  className?: string;
  rooms: RoomDetailedInfoFragment[];
}

export const RoomsList = styled(function RoomsList({ className, rooms }: Props) {
  return (
    <UIHolder className={className}>
      {rooms.map((room) => (
        <UICollapsibleRoomInfo key={room.id} room={room} topics={room.topics} />
      ))}
    </UIHolder>
  );
})``;

const UIHolder = styled.div<{}>``;

const UICollapsibleRoomInfo = styled(CollapsibleRoomInfo)<{}>`
  margin-bottom: 16px;
`;
