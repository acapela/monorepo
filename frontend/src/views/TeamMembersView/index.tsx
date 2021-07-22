import styled from "styled-components";
import { CurrentTeamMembersManager } from "./CurrentTeamMembersManager";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { SpacedAppLayoutContainer } from "~frontend/layouts/AppLayout/SpacedAppLayoutContainer";

export const TeamMembersView = () => {
  const user = useCurrentUser();

  if (!user?.currentTeamId) return null;

  return (
    <SpacedAppLayoutContainer topSpaceSize="large">
      <UIHolder>
        <CurrentTeamMembersManager />
      </UIHolder>
    </SpacedAppLayoutContainer>
  );
};

const UIHolder = styled.div`
  display: flex;
  justify-content: center;
  align-items: start;
`;
