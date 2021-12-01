import { observer } from "mobx-react";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { TeamEntity } from "~frontend/clientdb/team";
import { assert } from "~shared/assert";
import { CloseIconButton } from "~ui/buttons/CloseIconButton";
import { theme } from "~ui/theme";

import { InviteMemberForm } from "./InviteMemberForm";
import { ResendInviteButton } from "./ResendInviteButton";
import { TeamMemberBasicInfo } from "./TeamMemberBasicInfo";

interface Props {
  team: TeamEntity;
}

export const TeamMembersManager = observer(({ team }: Props) => {
  const currentUser = useAssertCurrentUser();

  const isCurrentUserTeamOwner = currentUser.id === team.owner_id;

  const handleRemoveTeamMember = (userId: string) => {
    const teamMember = team.members.query((teamMember) => teamMember.user_id === userId).all[0];
    assert(teamMember, `did not find teamMember for user ${userId}`);
    teamMember.remove();
  };

  return (
    <UIPanel>
      <InviteMemberForm team={team} />
      {team.members.hasItems && (
        <UISelectGridContainer>
          {team.members.all.map((teamMember) => (
            <UIItemHolder key={teamMember.id}>
              <TeamMemberBasicInfo teamMember={teamMember} />

              <UIActionsHolder>
                {!(teamMember.user?.has_account && teamMember.has_joined) && (
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  <ResendInviteButton user={teamMember.user!} teamId={team.id} />
                )}
                {isCurrentUserTeamOwner && (
                  <CloseIconButton
                    isDisabled={false}
                    onClick={() => teamMember.user && handleRemoveTeamMember(teamMember.user.id)}
                    title={`Remove ${teamMember.user?.name} from team`}
                    tooltip="Remove user from your team"
                  />
                )}
              </UIActionsHolder>
            </UIItemHolder>
          ))}
        </UISelectGridContainer>
      )}
    </UIPanel>
  );
});

const UIPanel = styled.div<{}>`
  display: flex;
  flex-direction: column;
  ${theme.spacing.pageSections.asGap};
`;

const UIItemHolder = styled.div<{}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px;
`;

const UIActionsHolder = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UISelectGridContainer = styled.div<{}>`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  ${theme.spacing.pageSections.asGap};

  width: 100%;
`;
