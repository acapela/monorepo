import styled from "styled-components";

import { SpacedAppLayoutContainer } from "~frontend/layouts/AppLayout/SpacedAppLayoutContainer";

import { OpenTopics } from "./OpenTopics";
import { UnresolvedRequests } from "./UnresolvedRequests";

export const ToDoView = () => {
  return (
    <SpacedAppLayoutContainer isNarrow topSpaceSize="large">
      <UIContent>
        <UnresolvedRequests />
        <OpenTopics />
      </UIContent>
    </SpacedAppLayoutContainer>
  );
};

const UIContent = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 64px;
`;
