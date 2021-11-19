import { observer } from "mobx-react";
import styled from "styled-components";

import { useDb } from "~frontend/clientdb";

import { RequestFeedGroups } from "./RequestFeedGroups/RequestFeedGroups";

export const RequestFeed = observer(() => {
  const db = useDb();
  // We dont need to sort here as request groups have its own sorting rules.
  const topics = db.topic.all;

  return (
    <UIHolder>
      <RequestFeedGroups topics={topics} />
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  height: 100%;
`;
