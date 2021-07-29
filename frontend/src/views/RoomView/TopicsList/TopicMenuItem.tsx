import { observer } from "mobx-react";
import { useRef } from "react";
import styled, { css } from "styled-components";
import { select } from "~shared/sharedState";
import { updateTopic } from "~frontend/gql/topics";
import { useRoomStoreContext } from "~frontend/rooms/RoomStore";
import { routes } from "~frontend/routes";
import { useTopicUnreadMessagesCount } from "~frontend/utils/unreadMessages";
import { TopicDetailedInfoFragment } from "~gql";
import { useBoolean } from "~shared/hooks/useBoolean";
import { theme } from "~ui/theme";
import { EditableText } from "~ui/forms/EditableText";
import { IconDragAndDrop } from "~ui/icons";
import { Popover } from "~ui/popovers/Popover";
import { hoverActionCss } from "~ui/transitions";
import { ManageTopic } from "./ManageTopic";
import { setColorOpacity } from "~shared/colors";

interface Props {
  topic: TopicDetailedInfoFragment;
  isActive: boolean;
  className?: string;
  isEditingDisabled?: boolean;
}

const TopicLink = routes.spaceRoomTopic.Link;

export const TopicMenuItem = styled(
  observer(function TopicMenuItem({ topic, isActive, className, isEditingDisabled }: Props) {
    const roomContext = useRoomStoreContext();
    const unreadCount = useTopicUnreadMessagesCount(topic.id);
    const hasUnreadMessaged = !isActive && unreadCount > 0;

    const [isShowingDragIcon, { set: showDragIcon, unset: hideDragIcon }] = useBoolean(false);
    const anchorRef = useRef<HTMLAnchorElement | null>(null);

    const isNewTopic = select(() => roomContext.newTopicId === topic.id);
    const isInEditMode = select(() => roomContext.editingNameTopicId === topic.id);

    function handleNewTopicName(newName: string) {
      updateTopic({ topicId: topic.id, input: { name: newName } });

      roomContext.editingNameTopicId = null;

      if (isNewTopic) {
        roomContext.newTopicId = null;
      }
    }

    return (
      <>
        <UIFlyingTooltipWrapper>
          <TopicLink params={{ topicId: topic.id, roomId: topic.room.id, spaceId: topic.room.space_id }}>
            <UIHolder
              ref={anchorRef}
              className={className}
              isActive={isActive}
              isClosed={!!topic.closed_at}
              onMouseEnter={showDragIcon}
              onMouseLeave={hideDragIcon}
            >
              {hasUnreadMessaged && <UIUnreadMessagesNotification />}
              <EditableText
                value={topic.name ?? ""}
                isInEditMode={isInEditMode}
                focusSelectMode={isNewTopic ? "select" : "cursor-at-end"}
                onEditModeChangeRequest={() => (roomContext.editingNameTopicId = topic.id)}
                onValueSubmit={handleNewTopicName}
              />
            </UIHolder>
          </TopicLink>
          {!isEditingDisabled && (
            <UIManageTopicWrapper>
              <ManageTopic topic={topic} onRenameRequest={() => (roomContext.editingNameTopicId = topic.id)} />
            </UIManageTopicWrapper>
          )}
        </UIFlyingTooltipWrapper>
        {isShowingDragIcon && !isEditingDisabled && (
          <Popover anchorRef={anchorRef} placement={"left"}>
            <IconDragAndDrop />
          </Popover>
        )}
      </>
    );
  })
)``;

const PADDING = "12px";

const UIHolder = styled.a<{ isActive: boolean; isClosed: boolean }>`
  position: relative;
  padding: ${PADDING} 24px;
  cursor: pointer;
  display: flex;
  width: 100%;
  align-items: center;

  ${theme.borderRadius.button}

  ${hoverActionCss}
  
  ${(props) => {
    if (props.isActive) {
      return css`
        background: ${(props) => setColorOpacity(props.theme.colors.interactive.selected, 0.8)};
      `;
    }
  }}

  ${(props) => {
    if (props.isClosed) {
      return css`
        text-decoration: line-through;
        opacity: 0.5;
      `;
    }
  }}

  ${EditableText} {
    display: block;
    flex-grow: 1;
  }
`;

const UIManageTopicWrapper = styled.div`
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
    &:hover ${UIManageTopicWrapper} {
      opacity: 1;
    }
  }
`;

const UIUnreadMessagesNotification = styled.div`
  position: absolute;
  left: 8px;

  height: 8px;
  width: 8px;
  ${theme.borderRadius.item}

  background-color: ${theme.colors.interactive.notification};
`;
