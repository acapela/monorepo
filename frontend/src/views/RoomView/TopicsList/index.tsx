import { gql } from "@apollo/client";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React, { useRef } from "react";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useIsCurrentUserRoomMember } from "~frontend/gql/rooms";
import { withFragments } from "~frontend/gql/utils";
import { createLastItemIndex, getIndexBetweenCurrentAndLast, getIndexBetweenItems } from "~frontend/rooms/order";
import { useRoomStoreContext } from "~frontend/rooms/RoomStore";
import { RouteLink, routes } from "~frontend/router";
import { useStartCreateNewTopicFlow } from "~frontend/topics/startCreateNewTopicFlow";
import { TopicList_RoomFragment } from "~gql";
import { generateId } from "~shared/id";
import { select } from "~shared/sharedState";
import { getUUID } from "~shared/uuid";
import { Button } from "~ui/buttons/Button";
import { CollapsePanel } from "~ui/collapse/CollapsePanel";
import { IconPlusSquare } from "~ui/icons";
import { VStack } from "~ui/Stack";
import { TextH6 } from "~ui/typo";

import { LazyTopicsList } from "./LazyTopicsList";
import { StaticTopicsList } from "./StaticTopicsList";

const fragments = {
  room: gql`
    ${useIsCurrentUserRoomMember.fragments.room}
    ${StaticTopicsList.fragments.room}

    fragment TopicList_room on room {
      id
      space_id
      topics {
        id
        index
      }
      ...IsCurrentUserRoomMember_room
      ...StaticTopicList_room
    }
  `,
};

interface Props {
  room: TopicList_RoomFragment;
  activeTopicId: string | null;
  isRoomOpen: boolean;
}

function getNewTopicIndex(topics: TopicList_RoomFragment["topics"], activeTopicId: string | null) {
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

const _TopicsList = observer(function TopicsList({ room, activeTopicId, isRoomOpen }: Props) {
  const user = useAssertCurrentUser();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { id: roomId, space_id: spaceId, topics } = room;
  const roomContext = useRoomStoreContext();

  const amIMember = useIsCurrentUserRoomMember(room);
  const startCreateNewTopicFlow = useStartCreateNewTopicFlow();

  const isEditingAnyMessage = select(() => !!roomContext.editingNameTopicId);

  async function handleCreateNewTopic() {
    const topicId = getUUID();
    const isCreated = await startCreateNewTopicFlow({
      topicId,
      ownerId: user.id,
      name: "New topic",
      slug: `new-topic-${generateId(5)}`,
      roomId,
      navigateAfterCreation: true,
      index: getNewTopicIndex(topics, activeTopicId),
    });

    runInAction(() => {
      roomContext.newTopicId = topicId;
      roomContext.editingNameTopicId = topicId;
    });

    if (isCreated) {
      routes.spaceRoomTopic.push({ topicId, spaceId, roomId });
    }
  }

  return (
    <CollapsePanel
      persistanceKey={`room-topics-${room.id}`}
      isInitiallyOpen
      headerNode={
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
        </UIHeader>
      }
    >
      <UIHolder>
        <LazyTopicsList
          room={room}
          activeTopicId={activeTopicId}
          isDisabled={isEditingAnyMessage}
          isStatic={!amIMember}
        />
        {topics.length === 0 && <UINoTopicsMessage>This room has no topics yet.</UINoTopicsMessage>}

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
      </UIHolder>
    </CollapsePanel>
  );
});

export const TopicsList = withFragments(fragments, _TopicsList);

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
