import styled from "styled-components";
import { RoomDetailedInfoFragment } from "~gql";
import { CollapsibleRoomInfo } from "./CollapsibleRoomInfo";

interface Props {
  className?: string;
  rooms: RoomDetailedInfoFragment[];
}

export const RoomsList = styled(function RoomsList({ className, rooms }: Props) {
  return (
    <UIHolder className={className}>
      {rooms.map((room) => {
        return (
          <UISingleRoomRecentTopics key={room.id}>
            <CollapsibleRoomInfo room={room} topics={room.topics} />
          </UISingleRoomRecentTopics>
        );
      })}
    </UIHolder>
  );
})``;

const UIHolder = styled.div``;

const UISingleRoomRecentTopics = styled.div`
  margin-bottom: 16px;
`;
