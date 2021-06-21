import styled from "styled-components";
import { RoomDetailedInfoFragment } from "~gql";
import { CollapsibleRoomInfo } from "~frontend/ui/rooms/RoomsList/CollapsibleRoomInfo";

interface Props {
  rooms: RoomDetailedInfoFragment[];
}

export function SpaceRooms({ rooms }: Props) {
  return (
    <UIHolder>
      {rooms.map((room) => {
        return <CollapsibleRoomInfo key={room.id} room={room} topics={room.topics} />;
      })}
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 2rem;
`;
