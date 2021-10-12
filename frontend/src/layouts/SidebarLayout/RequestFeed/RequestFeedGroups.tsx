import { observer } from "mobx-react";
import styled from "styled-components";

import { groupByFilter } from "~frontend/../../shared/groupByFilter";
import { TopicEntity } from "~frontend/clientdb/topic";

import { RequestsGroup } from "./RequestsGroup";

interface Props {
  topics: TopicEntity[];
}

function prepareTopicsGroups(topics: TopicEntity[]) {
  const [newTopics, notNewTopics] = groupByFilter(topics, (topic) => topic.isNew);
  const [openTopics, closedTopics] = groupByFilter(notNewTopics, (topic) => !topic.isClosed);

  return {
    newTopics,
    openTopics,
    closedTopics,
  };
}

export const RequestFeedGroups = observer(({ topics }: Props) => {
  const { newTopics, openTopics, closedTopics } = prepareTopicsGroups(topics);

  return (
    <UIHolder>
      {!!newTopics.length && <RequestsGroup topics={newTopics} groupName="New" />}
      {!!openTopics.length && <RequestsGroup topics={openTopics} groupName="Open" />}
      {!!closedTopics.length && <RequestsGroup topics={closedTopics} groupName="Closed" />}
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  overflow-x: hidden;
`;
