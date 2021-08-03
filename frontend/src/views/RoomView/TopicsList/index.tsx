import React, { useRef } from "react";
import styled from "styled-components";
import { isCurrentUserRoomMember } from "~frontend/gql/rooms";
import { useRoomStoreContext } from "~frontend/rooms/RoomStore";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import { IconPlusSquare } from "~ui/icons";
import { VStack } from "~ui/Stack";
import { startCreateNewTopicFlow } from "~frontend/topics/startCreateNewTopicFlow";
import { generateId } from "~shared/id";
import { createLastItemIndex, getIndexBetweenCurrentAndLast, getIndexBetweenItems } from "~frontend/rooms/order";
import { select } from "~shared/sharedState";
import { RoomDetailedInfoFragment } from "~gql";
import { useNewItemInArrayEffect } from "~shared/hooks/useNewItemInArrayEffect";
import { Button } from "~ui/buttons/Button";
import { CollapsePanel } from "~ui/collapse/CollapsePanel";
import { TextH6 } from "~ui/typo";
import { routes } from "~frontend/routes";
import { useRoomTopicList } from "~frontend/rooms/useRoomTopicList";
import { LazyTopicsList } from "./LazyTopicsList";
import { StaticTopicsList } from "./StaticTopicsList";

interface Props {
  room: RoomDetailedInfoFragment;
  activeTopicId: string | null;
  isRoomOpen: boolean;
}

function getNewTopicIndex(topics: RoomDetailedInfoFragment["topics"], activeTopicId: string | null) {
  const activeTopicNumIndex = topics.findIndex((t) => t.id == activeTopicId);
  if (activeTopicNumIndex == -1) {
    return createLastItemIndex(topics[topics.length - 1]?.index ?? "");
  }
  const activeTopicIndex = topics[activeTopicNumIndex].index;
  const nextTopic = topics[activeTopicNumIndex + 1];
  if (!nextTopic) {
    return getIndexBetweenCurrentAndLast(activeTopicIndex);
  }
  return getIndexBetweenItems(activeTopicIndex, nextTopic.index);
}

export const TopicsList = observer(function TopicsList({ room, activeTopicId, isRoomOpen }: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const roomId = room.id;
  const spaceId = room.space_id;
  const roomContext = useRoomStoreContext();

  const { topics, moveBetween, moveToStart, moveToEnd, isReordering } = useRoomTopicList(room.id);
  const amIMember = isCurrentUserRoomMember(room);

  const isEditingAnyMessage = select(() => !!roomContext.editingNameTopicId);

  async function handleCreateNewTopic() {
    await startCreateNewTopicFlow({
      name: "New topic",
      slug: `new-topic-${generateId(5)}`,
      roomId: room.id,
      navigateAfterCreation: true,
      index: getNewTopicIndex(topics, activeTopicId),
    });
  }

  useNewItemInArrayEffect(
    topics,
    (topic) => topic.id,
    (newTopic) => {
      runInAction(() => {
        roomContext.newTopicId = newTopic.id;
        roomContext.editingNameTopicId = newTopic.id;
      });
      routes.spaceRoomTopic.push({ topicId: newTopic.id, spaceId: room.space_id, roomId: room.id });
    }
  );

  return (
    <CollapsePanel
      persistanceKey={`room-topics-${room.id}`}
      initialIsOpened={true}
      headerNode={
        <UIHeader>
          <TextH6 spezia semibold>
            Topics
          </TextH6>
          {!isRoomOpen && (
            <routes.spaceRoomSummary.Link params={{ roomId, spaceId }}>
              <Button size="small" kind="secondary" ref={buttonRef}>
                Room summary
              </Button>
            </routes.spaceRoomSummary.Link>
          )}
        </UIHeader>
      }
    >
      <UIHolder>
        {amIMember && (
          <LazyTopicsList
            topics={topics}
            activeTopicId={activeTopicId}
            isDisabled={isEditingAnyMessage || isReordering}
            onMoveBetween={moveBetween}
            onMoveToStart={moveToStart}
            onMoveToEnd={moveToEnd}
          />
        )}
        {!amIMember && <StaticTopicsList topics={topics} activeTopicId={activeTopicId} />}
        {topics.length === 0 && <UINoTopicsMessage>This room has no topics yet.</UINoTopicsMessage>}

        <VStack alignItems="center" justifyContent="start">
          <UINewTopicButton
            kind="secondary"
            onClick={handleCreateNewTopic}
            isDisabled={!amIMember && { reason: `You have to be room member to ${isRoomOpen ? "close" : "open"} room` }}
            icon={<IconPlusSquare />}
            iconPosition="start"
          >
            New Topic
          </UINewTopicButton>
        </VStack>
      </UIHolder>
    </CollapsePanel>
  );
});

const UIHolder = styled.div<{}>`
  overflow-y: hidden;
  margin-top: 16px;
`;

const UIHeader = styled.div<{}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UINoTopicsMessage = styled.div<{}>``;

const UINewTopicButton = styled(Button)`
  margin-top: 8px;
  padding: 8px 48px;
`;
