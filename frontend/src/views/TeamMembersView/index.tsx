import styled from "styled-components";
import { MembersManagerContainer } from "~frontend/ui/MembersManager/MembersManagerContainer";

export const TeamMembersView = () => {
  return (
    <UIHolder>
      <MembersManagerContainer title="Team members">Here we go!</MembersManagerContainer>
    </UIHolder>
  );
};

const UIHolder = styled.div`
  display: flex;
  justify-content: center;
  align-items: start;

  min-height: 100%;
  padding-top: 84px;
`;
