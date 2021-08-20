import { gql, useMutation } from "@apollo/client";
import React, { useMemo } from "react";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { RoomBasicInfoFragment } from "~frontend/gql/rooms";
import { getIndexBetweenCurrentAndLast } from "~frontend/rooms/order";
import { openUIPrompt } from "~frontend/utils/prompt";
import { useDetailedRoomMessagesCount } from "~frontend/utils/unreadMessages";
import { CreateTopicMutation, CreateTopicMutationVariables, TopicDetailedInfoFragment } from "~gql";
import { groupByFilter } from "~shared/groupByFilter";
import { getUUID } from "~shared/uuid";
import { createLengthValidator } from "~shared/validation/inputValidation";
import { Button } from "~ui/buttons/Button";
import { EmptyStatePlaceholder } from "~ui/empty/EmptyStatePlaceholder";
import { IconChevronDown, IconChevronUp, IconPlusSquare } from "~ui/icons";

import { routes } from "../../../../router";
import { TopicCard } from "./TopicCard";
import { useExpandableListToggle } from "./useExpandableListToggle";

interface Props {
  roomId: string;
  topics: TopicDetailedInfoFragment[];
  isAbleToAddTopic: boolean;
  className?: string;
}
const MINIMIZED_TOPICS_SHOWN_LIMIT = 3;

function useStartCreateNewTopicFlow() {
  const [createTopic] = useMutation<CreateTopicMutation, CreateTopicMutationVariables>(gql`
    mutation CreateTopic($input: topic_insert_input!) {
      insert_topic_one(object: $input) {
        id
      }
    }
  `);
  return async function startCreateNewTopicFlow(
    input: Pick<CreateTopicMutationVariables["input"], "id" | "index" | "room_id" | "owner_id">
  ) {
    const name = await openUIPrompt({
      title: "New topic name",
      submitLabel: "Create topic",
      placeholder: "eg. Our brand colors",
      validateInput: createLengthValidator("Topic name", 3),
    });

    if (!name?.trim()) {
      return;
    }

    return createTopic({
      variables: {
        input: {
          name,
          slug: name.split(" ").join("-").toLowerCase(),
          ...input,
        },
      },
    });
  };
}

export const ExpandableTopicsList = styled(function ExpandableTopicsList({ topics, isAbleToAddTopic, roomId }: Props) {
  const user = useAssertCurrentUser();
  const startCreateNewTopicFlow = useStartCreateNewTopicFlow();

  const detailedRoomMessagesCount = useDetailedRoomMessagesCount(roomId);

  const orderedTopics = useMemo(() => {
    const [closedTopics, openTopics] = groupByFilter(topics, (topic) => !!topic.closed_at);

    const [unreadOpenTopics, readOpenTopics] = groupByFilter(
      openTopics,
      (openTopic) => detailedRoomMessagesCount[openTopic.id] > 0
    );

    return [...unreadOpenTopics, ...readOpenTopics, ...closedTopics];
  }, [detailedRoomMessagesCount, topics]);

  const {
    result: shownTopics,
    isExpandable: isTopicsListExpandable,
    isExpanded: isTopicsListExpanded,
    toggle: toggleExpandTopicList,
    itemsNotShown: topicsNotShownCount,
  } = useExpandableListToggle({ originalList: orderedTopics, minimizedLimit: MINIMIZED_TOPICS_SHOWN_LIMIT });

  async function handleCreateTopic() {
    const topicId = getUUID();
    await startCreateNewTopicFlow({
      id: topicId,
      room_id: roomId,
      owner_id: user.id,
      index: getIndexBetweenCurrentAndLast(topics[topics.length - 1]?.index ?? ""),
    });
    const room = RoomBasicInfoFragment.read(roomId);
    routes.spaceRoomTopic.push({ topicId, spaceId: room.space_id, roomId: room.id });
  }

  return (
    <>
      <UITopics>
        {shownTopics.length === 0 && <EmptyStatePlaceholder description="No topics in this room" />}
        {shownTopics.map((topic) => {
          return <TopicCard key={topic.id} topic={topic} />;
        })}
      </UITopics>
      <UITopicListActions>
        {isAbleToAddTopic && (
          <UIAddTopicButton kind="secondary" onClick={handleCreateTopic} icon={<IconPlusSquare />} iconPosition="start">
            New topic
          </UIAddTopicButton>
        )}

        {isTopicsListExpandable && (
          <>
            {!isTopicsListExpanded && (
              <UIToggleShowMoreTopics
                kind="secondary"
                icon={<IconChevronDown />}
                iconPosition="end"
                onClick={toggleExpandTopicList}
              >
                View all topics ({topicsNotShownCount})
              </UIToggleShowMoreTopics>
            )}

            {isTopicsListExpanded && (
              <UIToggleShowMoreTopics
                kind="secondary"
                icon={<IconChevronUp />}
                iconPosition="end"
                onClick={toggleExpandTopicList}
              >
                Minimize
              </UIToggleShowMoreTopics>
            )}
          </>
        )}
      </UITopicListActions>
    </>
  );
})``;

const UITopics = styled.div<{}>`
  ${TopicCard} {
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }

  flex: 1;
`;

const UITopicListActions = styled.div<{}>`
  margin-top: 24px;

  display: inline-flex;
  justify-content: space-between;

  align-items: center;
  width: 100%;
`;

const UIAddTopicButton = styled(Button)<{}>``;

const UIToggleShowMoreTopics = styled(Button)<{}>``;
