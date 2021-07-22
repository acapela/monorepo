import styled from "styled-components";
import { CurrentTeamMembersManager } from "./CurrentTeamMembersManager";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";

export const TeamMembersView = () => {
  const user = useCurrentUser();

  return <UIHolder>{user?.currentTeamId && <CurrentTeamMembersManager />}</UIHolder>;
};

const UIHolder = styled.div`
  display: flex;
  justify-content: center;
  align-items: start;

  min-height: 100%;
  padding-top: 84px;
`;
