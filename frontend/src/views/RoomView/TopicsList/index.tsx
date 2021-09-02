import { Reference, gql, useMutation } from "@apollo/client";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React, { useRef } from "react";
import styled from "styled-components";

import { assertReadUserDataFromCookie } from "~frontend/authentication/cookie";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useIsCurrentUserRoomMember } from "~frontend/gql/rooms";
import { withFragments } from "~frontend/gql/utils";
import {
  createLastItemIndex,
  getIndexBetweenCurrentAndLast,
  getIndexBetweenItems,
  getInitialIndexes,
} from "~frontend/rooms/order";
import { useRoomStoreContext } from "~frontend/rooms/RoomStore";
import { RouteLink, routes } from "~frontend/router";
import { byIndexAscending } from "~frontend/topics/utils";
import { CreateRoomViewTopicMutation, CreateRoomViewTopicMutationVariables, TopicList_RoomFragment } from "~gql";
import { select } from "~shared/sharedState";
import { getUUID } from "~shared/uuid";
import { Button } from "~ui/buttons/Button";
import { IconPlusSquare } from "~ui/icons";
import { VStack } from "~ui/Stack";
import { CategoryNameLabel } from "~ui/theme/functional";
import { Toggle } from "~ui/toggle";
import { TextH6 } from "~ui/typo";

import { LazyTopicsList } from "./LazyTopicsList";
import { StaticTopicsList, topicListTopicFragment } from "./StaticTopicsList";
import { getIsTopicArchived, getIsTopicPresent } from "./TopicsFilter";
import { useTopicsFilter } from "./useTopicsFilter";

const fragments = {
  room: gql`
    ${useIsCurrentUserRoomMember.fragments.room}
    ${StaticTopicsList.fragments.room}

    fragment TopicList_room on room {
      id
      space_id
      topics {
        archived_at
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

function getNewTopicIndex(topics: TopicList_RoomFragment["topics"], activeTopicId: string | null): string {
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

const createTopicFragment = gql`
  ${topicListTopicFragment}

  fragment TopicListCreateTopic on topic {
    id
    room_id
    ...TopicList_topic
  }
`;

const useCreateTopic = () =>
  useMutation<CreateRoomViewTopicMutation, CreateRoomViewTopicMutationVariables>(
    gql`
      ${createTopicFragment}

      mutation CreateRoomViewTopic(
        $id: uuid!
        $name: String!
        $slug: String!
        $index: String!
        $room_id: uuid!
        $owner_id: uuid!
      ) {
        topic: insert_topic_one(
          object: { id: $id, name: $name, slug: $slug, index: $index, room_id: $room_id, owner_id: $owner_id }
        ) {
          ...TopicListCreateTopic
        }
      }
    `,
    {
      optimisticResponse(vars) {
        const userData = assertReadUserDataFromCookie();
        return {
          __typename: "mutation_root",
          topic: {
            __typename: "topic",
            ...vars,
            owner: {
              __typename: "user",
              ...userData,
              avatar_url: userData.picture,
            },
            closed_at: null,
            closed_by_user_id: null,
            closed_by_user: null,
            closing_summary: null,
            archived_at: null,
          },
        };
      },
      update(cache, result) {
        const topic = result.data?.topic;
        if (!topic) {
          return;
        }
        const newTopicRef = cache.writeFragment({
          data: topic,
          fragment: topicListTopicFragment,
          fragmentName: "TopicList_topic",
        });
        if (!newTopicRef) {
          return;
        }
        cache.modify({
          id: cache.identify({ __typename: "room", id: topic.room_id }),
          fields: {
            topics: (existing: Reference[]) =>
              existing.some((ref) => ref.__ref == newTopicRef.__ref) ? existing : existing.concat(newTopicRef),
          },
        });
      },
    }
  );

const _TopicsList = observer(function TopicsList({
  room: roomWithoutAppliedFilters,
  activeTopicId,
  isRoomOpen,
}: Props) {
  const user = useAssertCurrentUser();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { id: roomId, space_id: spaceId, topics } = roomWithoutAppliedFilters;

  const { topicsFilter, requestChangeTopicsFilter } = useTopicsFilter({
    topics,
    activeTopicId,
    isRoomOpen,
  });

  const room: TopicList_RoomFragment = {
    ...roomWithoutAppliedFilters,
    topics:
      topicsFilter === "all"
        ? topics
        : (topics.filter(topicsFilter === "archived" ? getIsTopicArchived : getIsTopicPresent) as typeof topics),
  };

  const roomContext = useRoomStoreContext();

  const amIMember = useIsCurrentUserRoomMember(room);
  const isEditingAnyMessage = select(() => !!roomContext.editingNameTopicId);

  const [createTopic] = useCreateTopic();

  async function handleCreateNewTopic() {
    const topicId = getUUID();
    const { data } = await createTopic({
      variables: {
        id: topicId,
        name: "New Topic",
        slug: "new-topic",
        owner_id: user.id,
        room_id: roomId,
        index: getNewTopicIndex(topics, activeTopicId),
      },
    });

    runInAction(() => {
      roomContext.newTopicId = topicId;
      roomContext.editingNameTopicId = topicId;
    });

    if (data) {
      routes.spaceRoomTopic.push({ topicId, spaceId, roomId });
    }
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
        {topics.length > 0 && (
          <UITopicsListHolder>
            <LazyTopicsList
              room={room}
              activeTopicId={activeTopicId}
              isDisabled={isEditingAnyMessage}
              isStatic={!amIMember || topicsFilter === "archived"}
            />
          </UITopicsListHolder>
        )}

        {room.topics.length === 0 && (
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

export const TopicsList = withFragments(fragments, _TopicsList);

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
