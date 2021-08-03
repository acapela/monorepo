import React from "react";
import styled from "styled-components";
import { isCurrentUserRoomMember } from "~frontend/gql/rooms";
import { routes } from "~frontend/router";
import { NotificationCount } from "~frontend/ui/NotificationCount";
import { AvatarList } from "~frontend/ui/users/AvatarList";
import { RoomBasicInfoFragment, TopicDetailedInfoFragment } from "~gql";
import { niceFormatDate } from "~shared/dates/format";
import { useBoolean } from "~shared/hooks/useBoolean";
import { CollapseToggleButton } from "~ui/buttons/CollapseToggleButton";
import { CardBase } from "~ui/card/Base";
import { IconBox, IconCalendarDates, IconComment2Dots } from "~ui/icons";
import { ValueDescriptor } from "~ui/meta/ValueDescriptor";
import { GoogleCalendarIcon } from "~ui/social/GoogleCalendarIcon";
import { PrivateTag } from "~ui/tags";
import { theme } from "~ui/theme";
import { ExpandableTopicsList } from "./ExpandableTopicsList";
import { RouteLink } from "~frontend/router/RouteLink";

interface Props {
  room: RoomBasicInfoFragment;
  unreadMessages: number;
  topics: TopicDetailedInfoFragment[];
  className?: string;
}

export const CollapsibleRoomInfo = styled(function CollapsibleRoomInfo({
  room,
  topics,
  className,
  unreadMessages,
}: Props) {
  const [isOpen, { toggle: toggleIsOpen }] = useBoolean(false);

  const isAbleToAddTopic = !room.finished_at && isCurrentUserRoomMember(room);

  return (
    <UIHolder className={className}>
      <UIIndentBody>
        <UIHead>
          <UICollapseHolder isOpened={isOpen}>
            <CollapseToggleButton isOpened={isOpen} onToggle={toggleIsOpen} />
          </UICollapseHolder>
          <RouteLink route={routes.spaceRoom} params={{ roomId: room.id, spaceId: room.space_id }}>
            <UIHeadPrimary>
              <UIRoomName>
                {room.name}{" "}
                {room.source_google_calendar_event_id && (
                  <GoogleCalendarIcon data-tooltip="Connected to Google Calendar event" />
                )}
                {room.is_private && <PrivateTag />}
              </UIRoomName>

              <UIRoomMetaData>
                <ValueDescriptor keyNode={<NotificationCount value={unreadMessages} />} value={"New Messages"} />
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
                {<ValueDescriptor keyNode={<IconBox />} isIconKey value={room.space.name} />}
                <AvatarList users={room.members.map((membership) => membership.user)} />
              </UIRoomMetaData>
            </UIHeadPrimary>
          </RouteLink>
        </UIHead>
        {isOpen && (
          <UICollapsedItems>
            <ExpandableTopicsList topics={topics} roomId={room.id} isAbleToAddTopic={isAbleToAddTopic} />
          </UICollapsedItems>
        )}
      </UIIndentBody>
    </UIHolder>
  );
})``;

const UIHolder = styled(CardBase)<{}>``;

const UICollapseHolder = styled.div<{ isOpened: boolean }>`
  padding-right: 16px;
`;
const UIIndentBody = styled.div<{}>`
  flex: 1;
`;

const UIHead = styled.div<{}>`
  display: flex;
  align-items: center;
`;

const UIRoomName = styled.div<{}>`
  ${theme.font.h4.spezia.medium.build}
`;

const UIHeadPrimary = styled.div<{}>`
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

const UIRoomMetaData = styled.div<{}>`
  display: flex;
  align-items: center;
  gap: 24px;
  padding-top: 16px;
`;

const UICollapsedItems = styled.div<{}>`
  margin-top: 32px;
`;
