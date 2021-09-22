import { gql, useApolloClient, useSubscription } from "@apollo/client";
import { DraggableSyntheticListeners } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import React, { useCallback, useRef } from "react";
import styled, { css } from "styled-components";

import { assert } from "~frontend/../../shared/assert";
import { trackEvent } from "~frontend/analytics/tracking";
import { withFragments } from "~frontend/gql/utils";
import { useRoomStoreContext } from "~frontend/rooms/RoomStore";
import { RouteLink, routes } from "~frontend/router";
import { useTopicUnreadMessagesCount } from "~frontend/utils/unreadMessages";
import { TOPIC_WITH_MESSAGES_QUERY } from "~frontend/views/RoomView/TopicWithMessages/gql";
import {
  TopicMenuItemSubscription,
  TopicMenuItemSubscriptionVariables,
  TopicMenuItem_RoomFragment,
  TopicMenuItem_TopicFragment,
  TopicWithMessagesQuery,
  TopicWithMessagesQueryVariables,
} from "~gql";
import { useIsElementOrChildHovered } from "~shared/hooks/useIsElementOrChildHovered";
import { useSharedRef } from "~shared/hooks/useSharedRef";
import { select } from "~shared/sharedState";
import { PopPresenceAnimator } from "~ui/animations";
import { CircleIconButton } from "~ui/buttons/CircleIconButton";
import { EditableText } from "~ui/forms/EditableText";
import { IconCross, IconDragAndDrop } from "~ui/icons";
import { theme } from "~ui/theme";
import { hoverActionCss } from "~ui/transitions";

import { ManageTopic } from "./ManageTopic";
import { useDeleteTopic, useUpdateTopicName } from "./shared";
import { TopicOwner } from "./TopicOwner";

const fragments = {
  room: gql`
    ${TopicOwner.fragments.room}

    fragment TopicMenuItem_room on room {
      id
      space_id
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
  listeners?: DraggableSyntheticListeners;
  isDragged?: boolean;
};

type SortableTopicMenuItemProps = { isDisabled?: boolean } & React.ComponentProps<typeof TopicMenuItem>;

export const SortableTopicMenuItem = withFragments(
  fragments,
  ({ isDisabled, ...props }: SortableTopicMenuItemProps) => {
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

    return (
      <TopicMenuItem
        {...props}
        ref={setNodeRef}
        rootProps={{ ...attributes, style }}
        listeners={listeners}
        isDragged={isDragged}
      />
    );
  }
);

const _TopicMenuItem = React.forwardRef<HTMLDivElement, Props>(function TopicMenuItem(
  { room, topic, isActive, className, isEditingDisabled, listeners, isDragged, rootProps },
  ref
) {
  const innerRef = useSharedRef<HTMLDivElement | null>(null, [ref]);
  useSubscription<TopicMenuItemSubscription, TopicMenuItemSubscriptionVariables>(
    gql`
      ${fragments.topic}

      subscription TopicMenuItem($topicId: uuid!) {
        topic_by_pk(id: $topicId) {
          ...TopicMenuItem_topic
        }
      }
    `,
    { variables: { topicId: topic.id } }
  );
  const roomContext = useRoomStoreContext();
  const [updateTopicName] = useUpdateTopicName();
  const [deleteTopic] = useDeleteTopic();
  const unreadCount = useTopicUnreadMessagesCount(topic.id);
  const hasUnreadMessaged = !isActive && unreadCount > 0;

  const anchorRef = useRef<HTMLAnchorElement | null>(null);

  const isHovered = useIsElementOrChildHovered(innerRef);
  const isNewTopic = select(() => roomContext?.newTopicId === topic.id);
  const isInEditMode = select(() => roomContext?.editingNameTopicId === topic.id);

  const manageWrapperRef = useRef<HTMLDivElement | null>(null);

  const apolloClient = useApolloClient();
  const prefetchMessages = () => {
    apolloClient.query<TopicWithMessagesQuery, TopicWithMessagesQueryVariables>({
      query: TOPIC_WITH_MESSAGES_QUERY,
      variables: { topicId: topic.id },
    });
  };

  // We need to disable the Link while editing, so that selection does not trigger navigation
  const NameWrap = useCallback(
    (props: { children: React.ReactChild }) =>
      isInEditMode || isDragged ? (
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
    updateTopicName({ variables: { id: topic.id, name: newName } });

    assert(roomContext, "Room Context required");
    roomContext.editingNameTopicId = null;

    if (isNewTopic) {
      roomContext.newTopicId = null;
    }
  };

  return (
    <UIFlyingTooltipWrapper
      ref={innerRef}
      {...rootProps}
      isDragged={isDragged}
      onFocus={prefetchMessages}
      onMouseEnter={prefetchMessages}
    >
      <NameWrap>
        <UIHolder ref={anchorRef} className={className} isActive={isActive} isClosed={!!topic.closed_at}>
          <UITopicNameHolder>
            {hasUnreadMessaged && <UIUnreadMessagesNotification />}
            <EditableText
              value={topic.name ?? ""}
              isInEditMode={isInEditMode}
              focusSelectMode={isNewTopic ? "select" : "cursor-at-end"}
              onEditModeRequest={() => {
                assert(roomContext, "Room Context required");
                roomContext.editingNameTopicId = topic.id;
              }}
              onExitEditModeChangeRequest={() => {
                assert(roomContext, "Room Context required");
                if (roomContext.editingNameTopicId === topic.id) {
                  roomContext.editingNameTopicId = null;
                }
              }}
              onValueSubmit={handleNewTopicName}
              checkPreventClickAway={(event) =>
                Boolean(event.target instanceof Node && manageWrapperRef.current?.contains(event.target))
              }
            />
          </UITopicNameHolder>

          <TopicOwner room={room} topic={topic} />
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
                deleteTopic({ variables: { id: topic.id, roomId: room.id } });
                trackEvent("Deleted Topic", { topicId: topic.id });
              }}
            />
          ) : (
            <ManageTopic
              topic={topic}
              onRenameRequest={() => roomContext && (roomContext.editingNameTopicId = topic.id)}
            />
          )}
        </UIManageTopicWrapper>
      )}
      <AnimatePresence></AnimatePresence>
      {isHovered && !isEditingDisabled && (
        <UIDragIndicatorHolder {...listeners}>
          <IconDragAndDrop />
        </UIDragIndicatorHolder>
      )}
    </UIFlyingTooltipWrapper>
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

const UITopicNameHolder = styled.div<{}>`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const UIManageTopicWrapper = styled.div<{}>`
  position: absolute;
  right: ${PADDING};
  z-index: 1;

  @media (hover) {
    opacity: 0;
  }
`;

const UIFlyingTooltipWrapper = styled.div<{ isDragged?: boolean }>`
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;

  :focus {
    outline: none;
  }

  ${(props) =>
    props.isDragged &&
    css`
      cursor: grabbing;

      * {
        pointer-events: none;
      }
    `}

  @media (hover) {
    &:hover ${UIManageTopicWrapper} {
      opacity: 1;
    }
  }
`;

const UIUnreadMessagesNotification = styled.div<{}>`
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
  padding-right: 8px;
  cursor: grab;
`;
