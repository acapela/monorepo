import styled from "styled-components";
import { RoomBasicInfoFragment, TopicDetailedInfoFragment } from "~frontend/gql";
import { TopicCard } from "~frontend/ui/topics/TopicCard";
import { AvatarList } from "~frontend/ui/users/AvatarList";
import { Badge } from "~ui/Badge";
import { CardBase } from "~ui/card/Base";
import { ItemTitle } from "~ui/typo";

interface Props {
  room: RoomBasicInfoFragment;
  topics: TopicDetailedInfoFragment[];
  className?: string;
}

export const RoomRecentTopics = styled(function RoomRecentTopics({ room, topics, className }: Props) {
  return (
    <UIHolder className={className}>
      <UIHead>
        <UIHeadPrimary>
          <Badge>Room</Badge>
          <ItemTitle>{room.name}</ItemTitle>
        </UIHeadPrimary>

        <AvatarList users={room.members.map((membership) => membership.user)} />
      </UIHead>
      <UITopics>
        {topics.map((topic) => {
          return <TopicCard key={topic.id} topic={topic} />;
        })}
      </UITopics>
    </UIHolder>
  );
})``;

const UIHolder = styled(CardBase)``;
const UIHead = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;

  ${Badge} {
    margin-right: 8px;
  }
`;

const UIHeadPrimary = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const UITopics = styled.div`
  ${TopicCard} {
    &:not(:last-child) {
      margin-bottom: 1rem;
    }
  }
`;
