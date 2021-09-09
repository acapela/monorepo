import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React, { useRef } from "react";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { RoomEntity } from "~frontend/clientdb/room";
import { TopicEntity } from "~frontend/clientdb/topic";
import {
  createLastItemIndex,
  getIndexBetweenCurrentAndLast,
  getIndexBetweenItems,
  getInitialIndexes,
} from "~frontend/rooms/order";
import { useRoomStoreContext } from "~frontend/rooms/RoomStore";
import { RouteLink, routes } from "~frontend/router";
import { byIndexAscending } from "~frontend/topics/utils";
import { select } from "~shared/sharedState";
import { getUUID } from "~shared/uuid";
import { Button } from "~ui/buttons/Button";
import { IconPlusSquare } from "~ui/icons";
import { VStack } from "~ui/Stack";
import { CategoryNameLabel } from "~ui/theme/functional";
import { Toggle } from "~ui/toggle";
import { TextH6 } from "~ui/typo";

import { LazyTopicsList } from "./LazyTopicsList";
import { useTopicsFilter } from "./useTopicsFilter";

interface Props {
  room: RoomEntity;
  activeTopicId: string | null;
  isRoomOpen: boolean;
}

function getNewTopicIndex(topics: TopicEntity[], activeTopicId: string | null): string {
  if (topics.length == 0) {
    return getInitialIndexes(1)[0];
  }
  const sortedTopics = topics.slice().sort(byIndexAscending);
  const activeTopicNumIndex = sortedTopics.findIndex((t) => t.id == activeTopicId);
  if (activeTopicNumIndex == -1) {
    return createLastItemIndex(sortedTopics[sortedTopics.length - 1].index ?? "");
  }
  const activeTopicIndex = sortedTopics[activeTopicNumIndex].index;
  const nextTopic = sortedTopics[activeTopicNumIndex + 1];
  if (!nextTopic) {
    return getIndexBetweenCurrentAndLast(activeTopicIndex);
  }
  return getIndexBetweenItems(activeTopicIndex, nextTopic.index);
}

export const TopicsList = observer(function TopicsList({ room, activeTopicId, isRoomOpen }: Props) {
  const user = useAssertCurrentUser();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const allTopics = room.topics.all;

  const { id: roomId, space_id: spaceId } = room;

  const { topicsFilter, requestChangeTopicsFilter } = useTopicsFilter({
    topics: allTopics,
    activeTopicId,
    isRoomOpen,
  });

  function getFilteredTopics() {
    if (topicsFilter === "all") return allTopics;
    if (topicsFilter === "archived") return allTopics.filter((topic) => topic.isArchived);

    return allTopics.filter((topic) => !topic.isArchived);
  }

  const filteredTopics = getFilteredTopics();

  const roomContext = useRoomStoreContext();

  const amIMember = room.isCurrentUserMember;
  const isEditingAnyMessage = select(() => !!roomContext.editingNameTopicId);

  // TODOC
  function createTopic(input: any) {
    //
  }

  async function handleCreateNewTopic() {
    const topicId = getUUID();

    return;
    // TODOC

    runInAction(() => {
      roomContext.newTopicId = topicId;
      roomContext.editingNameTopicId = topicId;
    });

    routes.spaceRoomTopic.push({ topicId, spaceId, roomId });
  }

  return (
    <UIHolder>
      <UIHeader>
        <TextH6 spezia semibold>
          Topics
        </TextH6>
        {!isRoomOpen && (
          <RouteLink route={routes.spaceRoomSummary} params={{ roomId, spaceId }}>
            <Button size="small" kind="secondary" ref={buttonRef}>
              Room summary
            </Button>
          </RouteLink>
        )}
        {isRoomOpen && (
          <TopicsFilterHolder>
            <CategoryNameLabel>Archived</CategoryNameLabel>
            <Toggle
              isSet={topicsFilter === "archived"}
              size="small"
              onSet={() => requestChangeTopicsFilter("archived")}
              onUnset={() => requestChangeTopicsFilter("present")}
            />
          </TopicsFilterHolder>
        )}
      </UIHeader>
      <UIBody>
        {allTopics.length > 0 && (
          <UITopicsListHolder>
            <LazyTopicsList
              room={room}
              activeTopicId={activeTopicId}
              isDisabled={isEditingAnyMessage}
              isStatic={!amIMember || topicsFilter === "archived"}
            />
          </UITopicsListHolder>
        )}

        {allTopics.length === 0 && (
          <UINoTopicsMessage>
            {topicsFilter === "archived" ? "This room has no archived topics." : "This room has no topics yet."}{" "}
          </UINoTopicsMessage>
        )}

        <VStack alignItems="center" justifyContent="start">
          <UINewTopicButton
            kind="secondary"
            onClick={handleCreateNewTopic}
            isDisabled={
              isRoomOpen
                ? !amIMember && { reason: "You have to be room member to open a topic" }
                : { reason: "You can not create topics in closed rooms" }
            }
            icon={<IconPlusSquare />}
            iconPosition="start"
          >
            New Topic
          </UINewTopicButton>
        </VStack>
      </UIBody>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const UIBody = styled.div<{}>`
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const UITopicsListHolder = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const UIHeader = styled.div<{}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const UINoTopicsMessage = styled.div<{}>``;

const UINewTopicButton = styled(Button)`
  margin-top: 16px;
  padding: 8px 48px;
`;

const TopicsFilterHolder = styled.div`
  display: flex;
  gap: 8px;
`;
