import styled from "styled-components";
import { RoomDetailedInfoFragment } from "~gql";
import { RoomCard } from "~frontend/ui/rooms/RoomCard";

interface Props {
  rooms: RoomDetailedInfoFragment[];
}

export function SpaceRooms({ rooms }: Props) {
  return (
    <UIHolder>
      {rooms.map((room) => {
        return <RoomCard key={room.id} room={room} />;
      })}
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-row-gap: 3rem;
  grid-column-gap: 1rem;
`;
