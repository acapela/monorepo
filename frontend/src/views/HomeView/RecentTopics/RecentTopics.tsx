import styled from "styled-components";
import { useAssertCurrentTeamId } from "~frontend/authentication/useCurrentUser";
import { useRecentTopics } from "~frontend/gql/topics";
import { groupBy } from "./groupBy";
import { RoomRecentTopics } from "./RoomRecentTopics";

export function RecentTopics() {
  const teamId = useAssertCurrentTeamId();

  const [data] = useRecentTopics({ teamId, limit: 20 });

  const topics = data?.recentTopics ?? [];

  const roomGroups = groupBy(
    topics,
    (topic) => topic.room,
    (room) => room.id
  );

  return (
    <UIHolder>
      {roomGroups.map((roomGroup) => {
        return <RoomRecentTopics key={roomGroup.groupItem.id} room={roomGroup.groupItem} topics={roomGroup.items} />;
      })}
    </UIHolder>
  );
}

const UIHolder = styled.div`
  ${() => RoomRecentTopics} {
    margin-bottom: 1rem;
  }
`;
