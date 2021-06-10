import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { routes } from "~frontend/routes";
import { startCreateNewTopicFlow } from "~frontend/topics/startCreateNewTopicFlow";
import { Button } from "~ui/buttons/Button";
import { TopicMenuItem } from "./TopicMenuItem";
import { ItemTitle } from "~ui/typo";
import { ACTION_ACTIVE_COLOR } from "~ui/transitions";
import { useRoomTopicList } from "~frontend/rooms/useRoomTopicList";
import { useBulkTopicIndexing } from "~frontend/rooms/useBulkIndexing";
import { SortableTopicsList } from "./SortableTopicsList";

interface Props {
  roomId: string;
  activeTopicId: string | null;
}

export function TopicsList({ roomId, activeTopicId }: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [newlyCreatedTopic, setNewlyCreatedTopic] = useState<string | null>(null);

  const [bulkReorder, { loading: isExecutingBulkReorder }] = useBulkTopicIndexing();
  const { topics, moveBetween, moveToStart, moveToEnd, currentLastIndex, isReordering } = useRoomTopicList(roomId);

  /*
    ## Routing on new topic

    Routing to new topics is only done after finding our created topic inside a subscription.

    This is done in order to prevent a race-condition between room data, and mechanisms
    that handle routing in the Room page.

    ## Bulk reordering
    -- go to hook definition for explanation
  */
  useEffect(() => {
    if (topics && topics.every(({ index }) => !index || index.trim().length === 0)) {
      const topicIds = topics.map(({ id }) => id);
      bulkReorder(topicIds);
    }
    const found = topics.find(({ id }) => id === newlyCreatedTopic);
    if (found) {
      const {
        id: topicId,
        room: { space_id: spaceId, id: roomId },
      } = found;

      routes.spaceRoomTopic.push({ topicId, spaceId, roomId });
      setNewlyCreatedTopic(null);
    }
  }, [topics]);

  async function handleCreateTopic() {
    const topic = await startCreateNewTopicFlow({
      roomId,
      modalAnchor: {
        ref: buttonRef,
        placement: "bottom-start",
      },
      navigateAfterCreation: true,
      currentLastIndex,
    });

    setNewlyCreatedTopic(topic?.id ?? null);
  }

  return (
    <UIHolder>
      <UIHeader>
        <UITitle>Topics</UITitle>
        <UINewTopicButton ref={buttonRef} onClick={handleCreateTopic}>
          New topic
        </UINewTopicButton>
      </UIHeader>
      <SortableTopicsList
        topics={topics}
        activeTopicId={activeTopicId}
        isDisabled={isExecutingBulkReorder || isReordering}
        onMoveBetween={moveBetween}
        onMoveToStart={moveToStart}
        onMoveToEnd={moveToEnd}
      />
      {topics.length === 0 && <UINoTopicsMessage>This room has no topics yet.</UINoTopicsMessage>})
    </UIHolder>
  );
}

const UIHolder = styled.div`
  overflow-y: hidden;
`;

const UITitle = styled(ItemTitle)``;

const UINewTopicButton = styled(Button)``;

const UIHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const UIScrollContainer = styled.div`
  height: 100%;
  overflow-y: auto;
`;

export const UITopicsList = styled.div`
  &:last-child {
    margin-bottom: 72px;
  }
`;

export const UITopic = styled.div<{ isDragging: boolean }>`
  position: relative;

  margin-bottom: 8px;

  ${TopicMenuItem} {
    margin-bottom: 4px;
  }

  ${({ isDragging }) =>
    isDragging
      ? css`
          background: ${ACTION_ACTIVE_COLOR};
          border-radius: 8px;
        `
      : ""}
`;

const UINoTopicsMessage = styled.div``;
