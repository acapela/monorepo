import styled from "styled-components";
import { TopicDetailedInfoFragment } from "~gql";
import { groupBy } from "~shared/groupBy";
import { CollapsibleRoomInfo } from "./RoomsList/CollapsibleRoomInfo";

interface Props {
  className?: string;
  topics: TopicDetailedInfoFragment[];
}

export const TopicsGroupedByRooms = styled(function TopicsGroupedByRooms({ className, topics }: Props) {
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
            <CollapsibleRoomInfo room={roomGroup.groupItem} topics={roomGroup.items} />
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
