import styled from "styled-components";
import { RoomsQueryVariables } from "~gql";
import { CollapsibleRoomInfo } from "./CollapsibleRoomInfo";
import { useRoomsQuery } from "~frontend/gql/rooms";

interface Props {
  className?: string;
  query: RoomsQueryVariables;
}

export const QueriedRoomsList = styled(function QueriedRoomsList({ className, query }: Props) {
  const [rooms = []] = useRoomsQuery(query);

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
