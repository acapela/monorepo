import { gql, useSubscription } from "@apollo/client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { observer } from "mobx-react";
import React, { useCallback, useRef } from "react";
import styled, { css } from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { withFragments } from "~frontend/gql/utils";
import { useRoomStoreContext } from "~frontend/rooms/RoomStore";
import { RouteLink, routes } from "~frontend/router";
import { useTopicUnreadMessagesCount } from "~frontend/utils/unreadMessages";
import { useUpdateTopic } from "~frontend/views/RoomView/shared";
import {
  TopicMenuItemSubscription,
  TopicMenuItemSubscriptionVariables,
  TopicMenuItem_RoomFragment,
  TopicMenuItem_TopicFragment,
} from "~gql";
import { useBoolean } from "~shared/hooks/useBoolean";
import { select } from "~shared/sharedState";
import { CircleIconButton } from "~ui/buttons/CircleIconButton";
import { EditableText } from "~ui/forms/EditableText";
import { IconCross, IconDragAndDrop } from "~ui/icons";
import { Popover } from "~ui/popovers/Popover";
import { theme } from "~ui/theme";
import { hoverActionCss } from "~ui/transitions";

import { useDeleteTopic } from ".//shared";
import { ManageTopic } from "./ManageTopic";
import { TopicOwner } from "./TopicOwner";

const fragments = {
  room: gql`
    ${ManageTopic.fragments.room}
    ${TopicOwner.fragments.room}

    fragment TopicMenuItem_room on room {
      id
      space_id
      ...ManageTopic_room
      ...TopicOwner_room
    }
  `,
  topic: gql`
    ${ManageTopic.fragments.topic}
    ${TopicOwner.fragments.topic}

    fragment TopicMenuItem_topic on topic {
      id
      name
      closed_at
      ...ManageTopic_topic
      ...TopicOwner_topic
    }
  `,
};

type Props = {
  room: TopicMenuItem_RoomFragment;
  topic: TopicMenuItem_TopicFragment;
  isActive: boolean;
  className?: string;
  isEditingDisabled?: boolean;
  rootProps?: React.HTMLAttributes<HTMLDivElement>;
};

export const SortableTopicMenuItem = withFragments(
  fragments,
  ({ isDisabled, ...props }: { isDisabled?: boolean } & React.ComponentProps<typeof TopicMenuItem>) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
      id: props.topic.id,
      disabled: isDisabled,
    });

    const style = {
      // When an item is not actively dragged, transform will be null, and toString will turn it into undefined
      transform: CSS.Transform.toString(transform),
      transition: transition ?? undefined,
    };

    return <TopicMenuItem {...props} ref={setNodeRef} rootProps={{ ...attributes, ...listeners, style }} />;
  }
);

const _TopicMenuItem = React.forwardRef<HTMLDivElement, Props>(function TopicMenuItem(
  { room, topic, isActive, className, isEditingDisabled, rootProps },
  ref
) {
  useSubscription<TopicMenuItemSubscription, TopicMenuItemSubscriptionVariables>(
    gql`
      subscription TopicMenuItem($topicId: uuid!) {
        topic_by_pk(id: $topicId) {
          id
          name
          closed_at
        }
      }
    `,
    { variables: { topicId: topic.id } }
  );
  const roomContext = useRoomStoreContext();
  const [updateTopic] = useUpdateTopic();
  const [deleteTopic] = useDeleteTopic();
  const unreadCount = useTopicUnreadMessagesCount(topic.id);
  const hasUnreadMessaged = !isActive && unreadCount > 0;

  const [isShowingDragIcon, { set: showDragIcon, unset: hideDragIcon }] = useBoolean(false);
  const anchorRef = useRef<HTMLAnchorElement | null>(null);

  const isNewTopic = select(() => roomContext.newTopicId === topic.id);
  const isInEditMode = select(() => roomContext.editingNameTopicId === topic.id);

  const manageWrapperRef = useRef<HTMLDivElement | null>(null);

  // We need to disable the Link while editing, so that selection does not trigger navigation
  const NameWrap = useCallback(
    (props: { children: React.ReactChild }) =>
      isInEditMode ? (
        <React.Fragment {...props} />
      ) : (
        <RouteLink
          route={routes.spaceRoomTopic}
          params={{ topicId: topic?.id, roomId: room.id, spaceId: room.space_id }}
          {...props}
        />
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isInEditMode]
  );

  const handleNewTopicName = (newName: string) => {
    trackEvent("Renamed Topic", { topicId: topic.id, newTopicName: newName, oldTopicName: topic.name });
    updateTopic({ variables: { id: topic.id, input: { name: newName } } });

    roomContext.editingNameTopicId = null;

    if (isNewTopic) {
      roomContext.newTopicId = null;
    }
  };

  return (
    <>
      <UIFlyingTooltipWrapper ref={ref} {...rootProps}>
        <NameWrap>
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
            <TopicOwner room={room} topic={topic} />
          </UIHolder>
        </NameWrap>
        {!isEditingDisabled && (
          <UIManageTopicWrapper ref={manageWrapperRef}>
            {isNewTopic ? (
              <CircleIconButton
                size="small"
                icon={<IconCross />}
                onClick={() => {
                  deleteTopic({ variables: { id: topic.id } });
                  trackEvent("Deleted Topic", { topicId: topic.id });
                }}
              />
            ) : (
              <ManageTopic
                room={room}
                topic={topic}
                onRenameRequest={() => (roomContext.editingNameTopicId = topic.id)}
              />
            )}
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
});

export const TopicMenuItem = withFragments(fragments, styled<Props>(observer(_TopicMenuItem))``);

const PADDING = "12px";

const UIHolder = styled.a<{ isActive: boolean; isClosed: boolean }>`
  position: relative;
  padding: ${PADDING} 24px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;

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
