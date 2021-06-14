import styled from "styled-components";
import { useTopicsQuery } from "~frontend/gql/topics";
import { useTopicFilterVariables } from "./Filters/filter";
import { TopicFilters } from "./Filters/TopicFilters";
import { groupBy } from "./groupBy";
import { RoomRecentTopics } from "./RoomRecentTopics";

interface Props {
  className?: string;
}

export const RecentTopics = styled(function RecentTopics({ className }: Props) {
  const [topicQueryVariables, setFilters] = useTopicFilterVariables();

  const [topics = []] = useTopicsQuery(topicQueryVariables);

  const roomGroups = groupBy(
    topics,
    (topic) => topic.room,
    (room) => room.id
  );

  return (
    <UIHolder className={className}>
      <TopicFilters onFiltersChange={setFilters} />
      {roomGroups.map((roomGroup) => {
        return (
          <UISingleRoomRecentTopics key={roomGroup.groupItem.id}>
            <RoomRecentTopics room={roomGroup.groupItem} topics={roomGroup.items} />
          </UISingleRoomRecentTopics>
        );
      })}
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  ${TopicFilters} {
    margin-bottom: 32px;
  }
`;

const UISingleRoomRecentTopics = styled.div`
  margin-bottom: 1rem;
`;
