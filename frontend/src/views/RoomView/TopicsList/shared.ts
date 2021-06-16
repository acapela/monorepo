import styled from "styled-components";
import { TopicMenuItem } from "./TopicMenuItem";

export const UIScrollContainer = styled.div`
  height: 100%;
  overflow-y: auto;
`;

export const UITopicsList = styled.div`
  &:last-child {
    margin-bottom: 106px;
  }
`;

export const UITopic = styled.div<{ isDragging: boolean }>`
  position: relative;

  margin-bottom: 8px;

  ${TopicMenuItem} {
    margin-bottom: 4px;
  }
`;
