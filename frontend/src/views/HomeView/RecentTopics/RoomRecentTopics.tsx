import { useRef } from "react";
import styled from "styled-components";
import { Button } from "~ui/buttons/Button";
import { IconButton } from "~ui/buttons/IconButton";
import { IconChevronDown } from "~ui/icons";
import { routes } from "~frontend/routes";
import { RoomBasicInfoFragment, TopicDetailedInfoFragment } from "~frontend/gql";
import { useBoolean } from "~frontend/hooks/useBoolean";
import { startCreateNewTopicFlow } from "~frontend/topics/startCreateNewTopicFlow";
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

const RoomLink = routes.spaceRoom.Link;

export const RoomRecentTopics = styled(function RoomRecentTopics({ room, topics, className }: Props) {
  const [isOpened, { toggle: toggleIsOpened }] = useBoolean(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  async function handleCreateTopic() {
    await startCreateNewTopicFlow({
      roomId: room.id,
      modalAnchor: {
        ref: buttonRef,
        placement: "bottom-start",
      },
      navigateAfterCreation: true,
    });
  }

  return (
    <UIHolder className={className}>
      <UICollapseHolder isOpened={isOpened}>
        <IconButton icon={<IconChevronDown />} onClick={toggleIsOpened} />
      </UICollapseHolder>
      <UIIndentBody>
        <UIHead>
          <UIHeadPrimary>
            <Badge>Room</Badge>
            <RoomLink params={{ roomId: room.id, spaceId: room.space_id }}>
              <a>
                <ItemTitle>{room.name}</ItemTitle>
              </a>
            </RoomLink>
          </UIHeadPrimary>

          <AvatarList users={room.members.map((membership) => membership.user)} />
        </UIHead>
        {isOpened && (
          <>
            <UITopics>
              {topics.map((topic) => {
                return <TopicCard key={topic.id} topic={topic} />;
              })}
            </UITopics>
            <Button ref={buttonRef} onClick={handleCreateTopic}>
              Add topic
            </Button>
          </>
        )}
      </UIIndentBody>
    </UIHolder>
  );
})``;

const UIHolder = styled(CardBase)`
  display: flex;
`;
const UICollapseHolder = styled.div<{ isOpened: boolean }>`
  padding-right: 16px;

  ${IconButton} {
    font-size: 2rem;

    svg {
      transform: rotateZ(
        ${(props) => {
          return props.isOpened ? "-180deg" : "0deg";
        }}
      );
      transition: 0.15s all;
    }
  }
`;
const UIIndentBody = styled.div``;
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
      margin-bottom: 16px;
    }
  }

  margin-bottom: 24px;
`;
