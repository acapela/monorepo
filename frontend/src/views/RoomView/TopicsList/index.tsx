import React, { Suspense, useEffect, useRef, useState } from "react";
import { routes } from "~frontend/routes";
import { startCreateNewTopicFlow } from "~frontend/topics/startCreateNewTopicFlow";
import { Button } from "~ui/buttons/Button";
import { useRoomTopicList } from "~frontend/rooms/useRoomTopicList";
import { useBulkTopicIndexing } from "~frontend/rooms/useBulkIndexing";
import { ClientSideOnly } from "~ui/ClientSideOnly";
import { namedLazy } from "~shared/namedLazy";
import { StaticTopicsList } from "./StaticTopicsList";
import styled from "styled-components";
import { ItemTitle } from "~ui/typo";
import { RoomDetailedInfoFragment } from "~frontend/../../gql";
import { useAmIRoomMember } from "~frontend/gql/rooms";

const LazySortableTopicsList = namedLazy(() => import("./SortableTopicsList"), "SortableTopicsList");

LazySortableTopicsList.preload();

interface Props {
  room: RoomDetailedInfoFragment;
  activeTopicId: string | null;
}

export function TopicsList({ room, activeTopicId }: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [newlyCreatedTopic, setNewlyCreatedTopic] = useState<string | null>(null);
  const roomId = room.id;

  const [bulkReorder, { loading: isExecutingBulkReorder }] = useBulkTopicIndexing();
  const { topics, moveBetween, moveToStart, moveToEnd, currentLastIndex, isReordering } = useRoomTopicList(room.id);
  const amIMember = useAmIRoomMember(room);

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
        <ItemTitle>Topics</ItemTitle>
        <UINewTopicButton
          ref={buttonRef}
          onClick={handleCreateTopic}
          isDisabled={!amIMember && { reason: `You have to be room member to add new topics` }}
        >
          New topic
        </UINewTopicButton>
      </UIHeader>
      <ClientSideOnly>
        <Suspense fallback={<StaticTopicsList topics={topics} activeTopicId={activeTopicId} />}>
          <LazySortableTopicsList
            topics={topics}
            activeTopicId={activeTopicId}
            isDisabled={isExecutingBulkReorder || isReordering}
            onMoveBetween={moveBetween}
            onMoveToStart={moveToStart}
            onMoveToEnd={moveToEnd}
          />
        </Suspense>
      </ClientSideOnly>
      {topics.length === 0 && <UINoTopicsMessage>This room has no topics yet.</UINoTopicsMessage>})
    </UIHolder>
  );
}

const UIHolder = styled.div`
  overflow-y: hidden;
`;

const UINewTopicButton = styled(Button)``;

const UIHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const UINoTopicsMessage = styled.div``;
