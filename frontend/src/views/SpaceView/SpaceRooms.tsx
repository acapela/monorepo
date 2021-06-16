import styled from "styled-components";
import { RoomDetailedInfoFragment } from "~gql";
import { RoomCard } from "~frontend/ui/rooms/RoomCard";
import { TopicsInRoom } from "~frontend/ui/topics/TopicsInRoom";

interface Props {
  rooms: RoomDetailedInfoFragment[];
}

export function SpaceRooms({ rooms }: Props) {
  return (
    <UIHolder>
      {rooms.map((room) => {
        return <TopicsInRoom key={room.id} room={room} topics={room.topics} />;
      })}
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 2rem;
`;
