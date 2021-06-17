import { useRef } from "react";
import styled from "styled-components";
import { Button } from "~ui/buttons/Button";
import { IconButton } from "~ui/buttons/IconButton";
import { IconChevronRight } from "~ui/icons";
import { routes } from "~frontend/routes";
import { RoomBasicInfoFragment, TopicDetailedInfoFragment } from "~gql";
import { useBoolean } from "~shared/hooks/useBoolean";
import { startCreateNewTopicFlow } from "~frontend/topics/startCreateNewTopicFlow";
import { TopicCard } from "~frontend/ui/topics/TopicCard";
import { AvatarList } from "~frontend/ui/users/AvatarList";
import { useSingleSpaceQuery } from "~frontend/gql/spaces";
import { CardBase } from "~ui/card/Base";
import { ItemTitle } from "~ui/typo";
import { EmptyStatePlaceholder } from "~ui/empty/EmptyStatePlaceholder";
import { niceFormatDateTime } from "~shared/dates/format";
import { BACKGROUND_ACCENT } from "~ui/colors";

interface Props {
  room: RoomBasicInfoFragment;
  topics: TopicDetailedInfoFragment[];
  className?: string;
}

const RoomLink = routes.spaceRoom.Link;

export const TopicsInRoom = styled(function TopicsInRoom({ room, topics, className }: Props) {
  const [space] = useSingleSpaceQuery({ id: room.space_id });

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
        <IconButton icon={<IconChevronRight />} onClick={toggleIsOpen} />
      </UICollapseHolder>
      <UIIndentBody>
        <UIHead>
          <UIHeadPrimary>
            <RoomLink params={{ roomId: room.id, spaceId: room.space_id }}>
              <a>
                <ItemTitle>{room.name}</ItemTitle>
              </a>
            </RoomLink>
            <UIRoomMetaData>
              <UIRoomInfo>
                <strong>Due date:</strong> {niceFormatDateTime(new Date(room.deadline))}
              </UIRoomInfo>
              <UIRoomInfoSeparator />
              <UIRoomInfo>
                <strong>Space:</strong> {space?.name}
              </UIRoomInfo>
              <UIRoomInfoSeparator />
              <UIRoomInfo>
                <strong>Topics:</strong> {topics.length}
              </UIRoomInfo>
            </UIRoomMetaData>
          </UIHeadPrimary>

          <AvatarList users={room.members.map((membership) => membership.user)} />
        </UIHead>
        {isOpen && (
          <UICollapsedItems>
            <UITopics>
              {topics.length === 0 && <EmptyStatePlaceholder description="No topics in this room" />}
              {topics.map((topic) => {
                return <TopicCard key={topic.id} topic={topic} />;
              })}
            </UITopics>
            <Button ref={buttonRef} onClick={handleCreateTopic}>
              Add topic
            </Button>
          </UICollapsedItems>
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
          return props.isOpened ? "90deg" : "0deg";
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
`;

const UIHeadPrimary = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
`;

const UIRoomMetaData = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  padding-top: 16px;
`;

const UIRoomInfo = styled.div`
  & strong {
    font-weight: 600;
  }
`;

const UIRoomInfoSeparator = styled.div`
  height: 6px;
  width: 6px;
  border-radius: 6px;
  background-color: ${BACKGROUND_ACCENT};
`;

const UICollapsedItems = styled.div`
  margin-top: 32px;
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
