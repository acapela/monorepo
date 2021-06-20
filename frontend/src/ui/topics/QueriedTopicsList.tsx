import styled from "styled-components";
import { RoomsQueryVariables } from "~gql";
import { TopicsInRoom } from "./TopicsInRoom";
import { useRoomsQuery } from "~frontend/gql/rooms";

interface Props {
  className?: string;
  query: RoomsQueryVariables;
}

export const QueriedTopicsList = styled(function RecentTopics({ className, query }: Props) {
  const [rooms = []] = useRoomsQuery(query);

  return (
    <UIHolder className={className}>
      {rooms.map((room) => {
        return (
          <UISingleRoomRecentTopics key={room.id}>
            <TopicsInRoom room={room} topics={room.topics} />
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
