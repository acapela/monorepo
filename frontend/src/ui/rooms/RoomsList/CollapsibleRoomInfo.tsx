import React, { useRef, useState } from "react";
import styled from "styled-components";
import { theme } from "~ui/theme";
import { isCurrentUserRoomMember } from "~frontend/gql/rooms";
import { useSingleSpaceQuery } from "~frontend/gql/spaces";
import { routes } from "~frontend/routes";
import { startCreateNewTopicFlow } from "~frontend/topics/startCreateNewTopicFlow";
import { NotificationCount } from "~frontend/ui/NotificationCount";
import { TopicCard } from "~frontend/ui/rooms/RoomsList/TopicCard";
import { AvatarList } from "~frontend/ui/users/AvatarList";
import { useRoomUnreadMessagesCount } from "~frontend/utils/unreadMessages";
import { RoomBasicInfoFragment, TopicDetailedInfoFragment } from "~gql";
import { niceFormatDate } from "~shared/dates/format";
import { useBoolean } from "~shared/hooks/useBoolean";
import { Button } from "~ui/buttons/Button";
import { CollapseToggleButton } from "~ui/buttons/CollapseToggleButton";
import { CardBase } from "~ui/card/Base";
import { EmptyStatePlaceholder } from "~ui/empty/EmptyStatePlaceholder";
import { IconBox, IconCalendarDates, IconChevronDown, IconComment2Dots, IconPlusSquare } from "~ui/icons";
import { ValueDescriptor } from "~ui/meta/ValueDescriptor";
import { GoogleCalendarIcon } from "~ui/social/GoogleCalendarIcon";
import { PrivateTag } from "~ui/tags";
import { UICardListItem } from "./shared";

interface Props {
  room: RoomBasicInfoFragment;
  topics: TopicDetailedInfoFragment[];
  className?: string;
}

const INITIAL_TOPICS_SHOWN_LIMIT = 3;
const TOPICS_SHOWN_WITHOUT_LIMIT = Number.POSITIVE_INFINITY;

export const CollapsibleRoomInfo = styled(function CollapsibleRoomInfo({ room, topics, className }: Props) {
  // TODO: optimize !!
  const [space] = useSingleSpaceQuery({ id: room.space_id });

  const [isOpen, { toggle: toggleIsOpen }] = useBoolean(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [shownTopicsLimit, setShownTopicsLimit] = useState(INITIAL_TOPICS_SHOWN_LIMIT);

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

  const isAbleToAddTopic = !room.finished_at && isCurrentUserRoomMember(room);
  const topicsNotShownCount = topics.length - shownTopicsLimit;

  return (
    <UIHolder className={className}>
      <UIIndentBody>
        <UIHead>
          <UICollapseHolder isOpened={isOpen}>
            <CollapseToggleButton isOpened={isOpen} onToggle={toggleIsOpen} />
          </UICollapseHolder>
          <UIHeadPrimary
            onClick={() => {
              routes.spaceRoom.push({ roomId: room.id, spaceId: room.space_id });
            }}
          >
            <UIRoomName>
              {room.name}{" "}
              {room.source_google_calendar_event_id && (
                <GoogleCalendarIcon data-tooltip="Connected to Google Calendar event" />
              )}
              {room.is_private && <PrivateTag />}
            </UIRoomName>

            <UIRoomMetaData>
              <ValueDescriptor
                keyNode={<NotificationCount value={unreadNotificationsCount} />}
                value={"New Messages"}
              />
              <ValueDescriptor
                keyNode={<IconComment2Dots />}
                isIconKey
                value={`${topics.length} Topic${topics.length > 1 ? "s" : ""}`}
              />
              <ValueDescriptor
                keyNode={<IconCalendarDates />}
                isIconKey
                value={niceFormatDate(new Date(room.deadline), { showWeekDay: "short" })}
              />
              {space && <ValueDescriptor keyNode={<IconBox />} isIconKey value={space.name} />}
              <AvatarList users={room.members.map((membership) => membership.user)} />
            </UIRoomMetaData>
          </UIHeadPrimary>
        </UIHead>
        {isOpen && (
          <UICollapsedItems>
            <UITopics>
              {topics.length === 0 && <EmptyStatePlaceholder description="No topics in this room" />}
              {topics.slice(0, shownTopicsLimit).map((topic) => {
                return <TopicCard key={topic.id} topic={topic} />;
              })}
            </UITopics>
            {topicsNotShownCount > 0 && (
              <UIShowRemainingTopics onClick={() => setShownTopicsLimit(TOPICS_SHOWN_WITHOUT_LIMIT)}>
                <IconChevronDown /> Show remaining {topicsNotShownCount > 1 ? `${topicsNotShownCount} topics` : "topic"}
                ...
              </UIShowRemainingTopics>
            )}
            {isAbleToAddTopic && (
              <UIAddTopicButton
                kind="secondary"
                ref={buttonRef}
                onClick={handleCreateTopic}
                icon={<IconPlusSquare />}
                iconPosition="start"
              >
                New topic
              </UIAddTopicButton>
            )}
          </UICollapsedItems>
        )}
      </UIIndentBody>
    </UIHolder>
  );
})``;

const UIHolder = styled(CardBase)``;

const UICollapseHolder = styled.div<{ isOpened: boolean }>`
  padding-right: 16px;
`;

const UIIndentBody = styled.div`
  flex: 1;
`;

const UIHead = styled.div`
  display: flex;
  align-items: center;
`;

const UIRoomName = styled.div`
  ${theme.font.h4.spezia.medium.build}
`;

const UIHeadPrimary = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  cursor: pointer;

  ${UIRoomName} {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const UIRoomMetaData = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  padding-top: 16px;
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
`;

const UIShowRemainingTopics = styled(UICardListItem)`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  margin-top: 16px;

  & > svg {
    font-size: 1.5rem;
  }
`;

const UIAddTopicButton = styled(Button)`
  margin-top: 24px;
`;
