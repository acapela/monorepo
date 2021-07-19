import styled from "styled-components";
import { MembersManagerContainer } from "~frontend/ui/MembersManager/MembersManagerContainer";
import { useCurrentTeamDetails } from "~frontend/gql/teams";
import { MembersContainer } from "~frontend/ui/MembersManager/MembersContainer";
import { MemberItem } from "~frontend/ui/MembersManager/MemberItem";

export const TeamMembersView = () => {
  const [team] = useCurrentTeamDetails();

  const teamMembers = team?.memberships.map((membership) => membership.user) ?? [];

  return (
    <UIHolder>
      <MembersManagerContainer title="Team members">
        {teamMembers.length > 0 && (
          <MembersContainer>
            {teamMembers.map((user) => (
              <MemberItem key={user.id} user={user} onRemove={console.log} />
            ))}
          </MembersContainer>
        )}
      </MembersManagerContainer>
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
