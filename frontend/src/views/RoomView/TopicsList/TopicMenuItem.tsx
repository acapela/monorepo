import { DraggableSyntheticListeners } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import React, { useCallback, useRef } from "react";
import styled, { css } from "styled-components";

import { updateTopic } from "~frontend/gql/topics";
import { useRoomStoreContext } from "~frontend/rooms/RoomStore";
import { RouteLink, routes } from "~frontend/router";
import { useTopic } from "~frontend/topics/useTopic";
import { useTopicUnreadMessagesCount } from "~frontend/utils/unreadMessages";
import { TopicDetailedInfoFragment } from "~gql";
import { useBoolean } from "~shared/hooks/useBoolean";
import { select } from "~shared/sharedState";
import { PopPresenceAnimator } from "~ui/animations";
import { CircleIconButton } from "~ui/buttons/CircleIconButton";
import { EditableText } from "~ui/forms/EditableText";
import { IconCross, IconDragAndDrop } from "~ui/icons";
import { theme } from "~ui/theme";
import { hoverActionCss } from "~ui/transitions";

import { ManageTopic } from "./ManageTopic";
import { TopicOwner } from "./TopicOwner";

type Props = {
  topic: TopicDetailedInfoFragment;
  isActive: boolean;
  className?: string;
  isEditingDisabled?: boolean;

  rootProps?: React.HTMLAttributes<HTMLDivElement>;
  listeners?: DraggableSyntheticListeners;
};

export function SortableTopicMenuItem({
  isDisabled,
  ...props
}: { isDisabled?: boolean } & React.ComponentProps<typeof TopicMenuItem>) {
  const { attributes, listeners, setNodeRef, transform, transition, active } = useSortable({
    id: props.topic.id,
    disabled: isDisabled,
  });

  const isDragged = active?.id === props.topic.id;

  const style = {
    // When an item is not actively dragged, transform will be null, and toString will turn it into undefined
    transform: CSS.Transform.toString(transform),
    transition: transition ?? undefined,
    opacity: isDragged ? 0 : undefined,
  };

  return <TopicMenuItem {...props} ref={setNodeRef} rootProps={{ ...attributes, style }} listeners={listeners} />;
}

export const TopicMenuItem = styled<Props>(
  observer(
    React.forwardRef<HTMLDivElement, Props>(function TopicMenuItem(
      { topic, isActive, className, isEditingDisabled, listeners, rootProps },
      ref
    ) {
      const roomContext = useRoomStoreContext();
      const { deleteTopic } = useTopic(topic);
      const unreadCount = useTopicUnreadMessagesCount(topic.id);
      const hasUnreadMessaged = !isActive && unreadCount > 0;

      const [isShowingDragIcon, { set: showDragIcon, unset: hideDragIcon }] = useBoolean(false);
      const anchorRef = useRef<HTMLAnchorElement | null>(null);

      const isNewTopic = select(() => roomContext.newTopicId === topic.id);
      const isInEditMode = select(() => roomContext.editingNameTopicId === topic.id);

      const manageWrapperRef = useRef<HTMLDivElement | null>(null);

      function handleNewTopicName(newName: string) {
        updateTopic({ topicId: topic.id, input: { name: newName } });

        roomContext.editingNameTopicId = null;

        if (isNewTopic) {
          roomContext.newTopicId = null;
        }
      }

      // We need to disable the Link while editing, so that selection does not trigger navigation
      const NameWrap = useCallback(
        (props: { children: React.ReactChild }) =>
          isInEditMode ? (
            <React.Fragment {...props} />
          ) : (
            <RouteLink
              route={routes.spaceRoomTopic}
              params={{ topicId: topic.id, roomId: topic.room.id, spaceId: topic.room.space_id }}
              {...props}
            />
          ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isInEditMode]
      );

      return (
        <UIFlyingTooltipWrapper ref={ref} {...rootProps}>
          <NameWrap>
            <UIHolder
              {...listeners}
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
                onEditModeRequest={() => {
                  roomContext.editingNameTopicId = topic.id;
                }}
                onExitEditModeChangeRequest={() => {
                  if (roomContext.editingNameTopicId === topic.id) {
                    roomContext.editingNameTopicId = null;
                  }
                }}
                onValueSubmit={handleNewTopicName}
                checkPreventClickAway={(event) =>
                  Boolean(event.target instanceof Node && manageWrapperRef.current?.contains(event.target))
                }
              />
              <TopicOwner topic={topic} />
            </UIHolder>
          </NameWrap>
          {!isEditingDisabled && (
            <UIManageTopicWrapper
              ref={manageWrapperRef}
              onMouseDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            >
              {isNewTopic ? (
                <CircleIconButton
                  size="small"
                  icon={<IconCross />}
                  onClick={() => {
                    deleteTopic();
                  }}
                />
              ) : (
                <ManageTopic topic={topic} onRenameRequest={() => (roomContext.editingNameTopicId = topic.id)} />
              )}
            </UIManageTopicWrapper>
          )}
          <AnimatePresence></AnimatePresence>

          {isShowingDragIcon && !isEditingDisabled && (
            <UIDragIndicatorHolder>
              <IconDragAndDrop />
            </UIDragIndicatorHolder>
          )}
        </UIFlyingTooltipWrapper>
      );
    })
  )
)``;

const PADDING = "12px";

const UIHolder = styled.a<{ isActive: boolean; isClosed: boolean }>`
  position: relative;
  padding: ${PADDING} 24px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  touch-action: none;

  ${theme.borderRadius.button}

  ${hoverActionCss}

  ${(props) => {
    if (props.isActive) {
      return css`
        background: ${theme.colors.interactive.selected()};
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

const UIManageTopicWrapper = styled.div<{}>`
  position: absolute;
  right: ${PADDING};
  z-index: 1;

  @media (hover) {
    opacity: 0;
  }
`;

const UIFlyingTooltipWrapper = styled.div<{}>`
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;

  :focus {
    outline: none;
  }

  @media (hover) {
    &:hover ${UIManageTopicWrapper} {
      opacity: 1;
    }
  }
`;

const UIUnreadMessagesNotification = styled.div<{}>`
  position: absolute;
  left: 8px;

  height: 8px;
  width: 8px;
  ${theme.borderRadius.item}

  background-color: ${theme.colors.interactive.notification()};
`;

const UIDragIndicatorHolder = styled(PopPresenceAnimator)`
  position: absolute;
  left: 0px;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  padding-left: 3px;
  pointer-events: none;
`;
