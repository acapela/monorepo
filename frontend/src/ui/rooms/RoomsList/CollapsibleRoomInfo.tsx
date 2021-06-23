import React, { useRef } from "react";
import styled from "styled-components";
import { Button } from "~ui/buttons/Button";
import { IconButton } from "~ui/buttons/IconButton";
import { IconChevronRight } from "~ui/icons";
import { routes } from "~frontend/routes";
import { RoomBasicInfoFragment, TopicDetailedInfoFragment } from "~gql";
import { useBoolean } from "~shared/hooks/useBoolean";
import { startCreateNewTopicFlow } from "~frontend/topics/startCreateNewTopicFlow";
import { TopicCard } from "~frontend/ui/rooms/RoomsList/TopicCard";
import { AvatarList } from "~frontend/ui/users/AvatarList";
import { useSingleSpaceQuery } from "~frontend/gql/spaces";
import { CardBase } from "~ui/card/Base";
import { ItemTitle } from "~ui/typo";
import { EmptyStatePlaceholder } from "~ui/empty/EmptyStatePlaceholder";
import { niceFormatDateTime } from "~shared/dates/format";
import { BACKGROUND_ACCENT } from "~ui/colors";
import { useRoomUnreadMessagesCount } from "~frontend/utils/unreadMessages";
import { formatNumberWithMaxValue } from "~shared/numbers";
import { ElementNotificationBadge } from "~frontend/ui/ElementNotificationBadge";

interface Props {
  room: RoomBasicInfoFragment;
  topics: TopicDetailedInfoFragment[];
  className?: string;
}

export const CollapsibleRoomInfo = styled(function CollapsibleRoomInfo({ room, topics, className }: Props) {
  const [space] = useSingleSpaceQuery({ id: room.space_id });

  const [isOpen, { toggle: toggleIsOpen }] = useBoolean(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const unreadNotificationsCount = useRoomUnreadMessagesCount(room.id);

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
      {unreadNotificationsCount > 0 && (
        <ElementNotificationBadge>{formatNumberWithMaxValue(unreadNotificationsCount, 99)}</ElementNotificationBadge>
      )}

      <UIHead>
        <UICollapseHolder isOpened={isOpen}>
          <IconButton icon={<IconChevronRight />} onClick={toggleIsOpen} />
        </UICollapseHolder>
        <UIHeadPrimary
          onClick={() => {
            routes.spaceRoom.push({ roomId: room.id, spaceId: room.space_id });
          }}
        >
          <ItemTitle>{room.name}</ItemTitle>

          <UIRoomMetaData>
            <UIRoomInfo>
              <UIRoomInfoKey>Due date:</UIRoomInfoKey>{" "}
              <UIRoomInfoValue>{niceFormatDateTime(new Date(room.deadline))}</UIRoomInfoValue>
            </UIRoomInfo>
            <UIRoomInfoSeparator />
            {space && (
              <UIRoomInfo>
                <UIRoomInfoKey>Space:</UIRoomInfoKey> <UIRoomInfoValue>{space?.name}</UIRoomInfoValue>
              </UIRoomInfo>
            )}
            <UIRoomInfoSeparator />
            <UIRoomInfo>
              <UIRoomInfoKey>Topics:</UIRoomInfoKey> <UIRoomInfoValue>{topics.length}</UIRoomInfoValue>
            </UIRoomInfo>
          </UIRoomMetaData>
        </UIHeadPrimary>

        <AvatarList users={room.members.map((membership) => membership.user)} />
      </UIHead>
      <UIIndentBody>
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
  position: relative;
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
  cursor: pointer;
`;

const UIRoomMetaData = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 16px;
`;

const UIRoomInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const UIRoomInfoKey = styled.div`
  font-weight: 600;
`;

const UIRoomInfoValue = styled.div`
  opacity: 0.5;
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
