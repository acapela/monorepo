import { useState } from "react";
import styled from "styled-components";
import { useAssertCurrentTeamId, useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useRecentTopics } from "~frontend/gql/topics";
import { getRecentTopicVariablesFromFilters, RecentTopicsFilter } from "./Filters/filter";
import { RecentTopicFilters } from "./Filters/RecentTopicFilters";
import { groupBy } from "./groupBy";
import { RoomRecentTopics } from "./RoomRecentTopics";

interface Props {
  className?: string;
}

export const RecentTopics = styled(function RecentTopics({ className }: Props) {
  const [filters, setFilters] = useState<RecentTopicsFilter[]>([]);
  const teamId = useAssertCurrentTeamId();
  const user = useAssertCurrentUser();

  const variables = getRecentTopicVariablesFromFilters(user.id, teamId, filters);

  const [data] = useRecentTopics(variables);

  const topics = data?.recentTopics ?? [];

  const roomGroups = groupBy(
    topics,
    (topic) => topic.room,
    (room) => room.id
  );

  return (
    <UIHolder className={className}>
      <RecentTopicFilters onFiltersChange={setFilters} />
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
  ${RecentTopicFilters} {
    margin-bottom: 32px;
  }
`;

const UISingleRoomRecentTopics = styled.div`
  margin-bottom: 1rem;
`;
