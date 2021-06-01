import styled from "styled-components";
import { useAssertCurrentTeamId, useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useRecentTopics } from "~frontend/gql/topics";
import { groupBy } from "./groupBy";
import { RoomRecentTopics } from "./RoomRecentTopics";

interface Props {
  className?: string;
}

export const RecentTopics = styled(function RecentTopics({ className }: Props) {
  const teamId = useAssertCurrentTeamId();
  const user = useAssertCurrentUser();

  const [data] = useRecentTopics({ teamId, limit: 20, userId: user.id });

  const topics = data?.recentTopics ?? [];

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
            <RoomRecentTopics room={roomGroup.groupItem} topics={roomGroup.items} />
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
