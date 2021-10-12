import { observer } from "mobx-react";
import styled from "styled-components";

import { useDb } from "~frontend/clientdb";

import { RequestFeedGroups } from "./RequestFeedGroups";

interface Props {
  topicSlug?: string;
}

export const RequestFeed = observer(({ topicSlug }: Props) => {
  const db = useDb();
  const topics = db.topic.query({ sort: (topic) => topic.lastActivityDate }).all;

  return (
    <UIHolder>
      <RequestFeedGroups topics={topics} />
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>``;
