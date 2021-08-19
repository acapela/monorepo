import styled from "styled-components";

import { TopicMenuItem } from "./TopicMenuItem";

export const UITopicsList = styled.div<{}>`
  min-height: 0;
  overflow-y: auto;
`;

export const UITopic = styled.div`
  position: relative;

  margin-bottom: 8px;

  ${TopicMenuItem} {
    margin-bottom: 4px;
  }
`;
