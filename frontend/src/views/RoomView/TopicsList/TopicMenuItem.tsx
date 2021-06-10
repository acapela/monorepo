import styled, { css } from "styled-components";
import { routes } from "~frontend/routes";
import { TopicDetailedInfoFragment } from "~frontend/gql";
import { hoverActionCss, ACTION_ACTIVE_COLOR } from "~ui/transitions";
import { ManageTopic } from "./ManageTopic";
import { useTopicUnreadMessagesCount } from "~frontend/utils/unreadMessages";
import { ElementNotificationBadge } from "~frontend/ui/ElementNotificationBadge";
import { formatNumberWithMaxCallback } from "~shared/numbers";

interface Props {
  topic: TopicDetailedInfoFragment;
  isActive: boolean;
  className?: string;
}

const TopicLink = routes.spaceRoomTopic.Link;

export const TopicMenuItem = styled(function TopicMenuItem({ topic, isActive, className }: Props) {
  const unreadCount = useTopicUnreadMessagesCount(topic.id);
  const shouldShowNotificationsBadge = !isActive && unreadCount > 0;
  return (
    <UIFlyingTooltipWrapper>
      <TopicLink params={{ topicId: topic.id, roomId: topic.room.id, spaceId: topic.room.space_id }}>
        <UIHolder className={className} isActive={isActive} isClosed={!!topic.closed_at}>
          {shouldShowNotificationsBadge && (
            <ElementNotificationBadge>{formatNumberWithMaxCallback(unreadCount, 99)}</ElementNotificationBadge>
          )}
          {topic.name}
        </UIHolder>
      </TopicLink>
      <UIManageTopicWr>
        <ManageTopic topic={topic} />
      </UIManageTopicWr>
    </UIFlyingTooltipWrapper>
  );
})``;

const PADDING = "12px";

const UIHolder = styled.a<{ isActive: boolean; isClosed: boolean }>`
  position: relative;
  padding: ${PADDING};
  cursor: pointer;
  display: flex;
  width: 100%;

  ${hoverActionCss}

  ${(props) => {
    if (props.isActive) {
      return css`
        background: ${ACTION_ACTIVE_COLOR};
      `;
    }
  }}

  ${(props) => {
    if (props.isClosed) {
      return css`
        text-decoration: line-through;
        color: hsla(211, 12%, 62%, 1);
      `;
    }
  }}
`;

const UIManageTopicWr = styled.div`
  position: absolute;
  right: ${PADDING};
  z-index: 1;

  @media (hover) {
    opacity: 0;
  }
`;

const UIFlyingTooltipWrapper = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;

  @media (hover) {
    &:hover ${UIManageTopicWr} {
      opacity: 1;
    }
  }
`;
