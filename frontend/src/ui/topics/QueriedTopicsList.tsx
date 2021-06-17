import styled from "styled-components";
import { TopicsQueryVariables } from "~gql";
import { useTopicsQuery } from "~frontend/gql/topics";
import { groupBy } from "~shared/groupBy";
import { TopicsInRoom } from "./TopicsInRoom";

interface Props {
  className?: string;
  query: TopicsQueryVariables;
}

export const QueriedTopicsList = styled(function RecentTopics({ className, query }: Props) {
  const [topics = []] = useTopicsQuery(query);

  const roomGroups = groupBy(
    topics,
    (topic) => topic.room,
    (room) => room.id
  );

  return (
    <UIHolder className={className}>
      {roomGroups.map((roomGroup) => {
        return (
          <UISingleRoomRecentTopics key={roomGroup.groupItem.id}>
            <TopicsInRoom room={roomGroup.groupItem} topics={roomGroup.items} />
          </UISingleRoomRecentTopics>
        );
      })}
    </UIHolder>
  );
})``;

const UIHolder = styled.div``;

const UISingleRoomRecentTopics = styled.div`
  margin-bottom: 1rem;
`;
