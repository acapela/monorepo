import { useRef } from "react";
import styled from "styled-components";
import { Button } from "~ui/buttons/Button";
import { IconButton } from "~ui/buttons/IconButton";
import { IconChevronDown } from "~ui/icons";
import { routes } from "~frontend/routes";
import { RoomBasicInfoFragment, TopicDetailedInfoFragment } from "~gql";
import { useBoolean } from "~shared/hooks/useBoolean";
import { startCreateNewTopicFlow } from "~frontend/topics/startCreateNewTopicFlow";
import { TopicCard } from "~frontend/ui/topics/TopicCard";
import { AvatarList } from "~frontend/ui/users/AvatarList";
import { Badge } from "~ui/Badge";
import { CardBase } from "~ui/card/Base";
import { ItemTitle } from "~ui/typo";
import { EmptyStatePlaceholder } from "~ui/empty/EmptyStatePlaceholder";

interface Props {
  room: RoomBasicInfoFragment;
  topics: TopicDetailedInfoFragment[];
  className?: string;
}

const RoomLink = routes.spaceRoom.Link;

export const TopicsInRoom = styled(function TopicsInRoom({ room, topics, className }: Props) {
  const [isOpen, { toggle: toggleIsOpen }] = useBoolean(false);
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
      <UICollapseHolder isOpened={isOpen}>
        <IconButton icon={<IconChevronDown />} onClick={toggleIsOpen} />
      </UICollapseHolder>
      <UIIndentBody>
        <UIHead>
          <UIHeadPrimary>
            <Badge>Room</Badge>
            {room && (
              <RoomLink params={{ roomId: room.id, spaceId: room.space_id }}>
                <a>
                  <ItemTitle>{room.name}</ItemTitle>
                </a>
              </RoomLink>
            )}
          </UIHeadPrimary>

          <AvatarList users={room.members.map((membership) => membership.user)} />
        </UIHead>
        {isOpen && (
          <>
            <UITopics>
              {topics.length === 0 && <EmptyStatePlaceholder description="No topics in this room" />}
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
const UIIndentBody = styled.div`
  flex: 1;
`;
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

  flex: 1;

  margin-bottom: 24px;
`;
