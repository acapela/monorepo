import styled from "styled-components";
import { useAssertCurrentTeamId } from "~frontend/authentication/useCurrentUser";
import { ManageCurrentTeamMembers } from "./ManageCurrentTeamMembers";

export const TeamMembersView = () => {
  const teamId = useAssertCurrentTeamId();

  return <UIHolder>{teamId && <ManageCurrentTeamMembers />}</UIHolder>;
};

const UIHolder = styled.div`
  display: flex;
  justify-content: center;
  align-items: start;

  min-height: 100%;
  padding-top: 84px;
`;
