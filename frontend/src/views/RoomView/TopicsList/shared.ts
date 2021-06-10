import styled, { css } from "styled-components";
import { ACTION_ACTIVE_COLOR } from "~frontend/../../ui/transitions";
import { TopicMenuItem } from "./TopicMenuItem";

export const UIScrollContainer = styled.div`
  height: 100%;
  overflow-y: auto;
`;

export const UITopicsList = styled.div`
  &:last-child {
    margin-bottom: 72px;
  }
`;

export const UITopic = styled.div<{ isDragging: boolean }>`
  position: relative;

  margin-bottom: 8px;

  ${TopicMenuItem} {
    margin-bottom: 4px;
  }

  ${({ isDragging }) =>
    isDragging
      ? css`
          background: ${ACTION_ACTIVE_COLOR};
          border-radius: 8px;
        `
      : ""}
`;
