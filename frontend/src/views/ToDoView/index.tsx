import styled from "styled-components";

import { OpenTopics } from "./OpenTopics";
import { UnresolvedRequests } from "./UnresolvedRequests";

export const ToDoView = () => {
  return (
    <UIContent>
      <UnresolvedRequests />

      <OpenTopics />
    </UIContent>
  );
};

const UIContent = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 64px;
`;
