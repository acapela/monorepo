import { observer } from "mobx-react";
import styled from "styled-components";

import { useDb } from "~frontend/clientdb";
import { theme } from "~ui/theme";

import { RequestFeedGroups } from "./RequestFeedGroups";
import { RequestItem } from "./RequestItem";

interface Props {
  topicSlug?: string;
}

export const RequestFeed = observer(({ topicSlug }: Props) => {
  const db = useDb();
  const topics = db.topic.all;

  return (
    <UIHolder>
      <RequestFeedGroups topics={topics} />
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  overflow-x: hidden;
`;
