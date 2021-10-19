import { observer } from "mobx-react";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { TeamEntity } from "~frontend/clientdb/team";
import { assert } from "~shared/assert";
import { isNotNullish } from "~shared/nullish";
import { CloseIconButton } from "~ui/buttons/CloseIconButton";
import { theme } from "~ui/theme";

import { InviteMemberForm } from "./InviteMemberForm";
import { ResendInviteButton } from "./ResendInviteButton";
import { UserBasicInfo } from "./UserBasicInfo";

interface Props {
  team: TeamEntity;
}

export const TeamMembersManager = observer(({ team }: Props) => {
  const currentUser = useAssertCurrentUser();

  const isCurrentUserTeamOwner = currentUser.id === team.owner_id;

  const teamUsers = team.members.all.map((teamMember) => teamMember.user).filter(isNotNullish) ?? [];

  const handleRemoveTeamMember = (userId: string) => {
    const teamMember = team.members.query((teamMember) => teamMember.user_id === userId).all[0];
    assert(teamMember, "did not find teamMember");
    teamMember.remove();
    trackEvent("Account Removed User", { teamId: team.id, userId });
  };

  return (
    <UIPanel>
      <InviteMemberForm team={team} />
      {teamUsers.length > 0 && (
        <UISelectGridContainer>
          {teamUsers.map((user) => (
            <UIItemHolder key={user.id}>
              <UserBasicInfo user={user} />

              <UIActionsHolder>
                {!user.has_account && <ResendInviteButton user={user} teamId={team.id} />}
                {!(user.id === team.owner_id) && (
                  <CloseIconButton
                    isDisabled={!isCurrentUserTeamOwner}
                    onClick={() => handleRemoveTeamMember(user.id)}
                    tooltip={isCurrentUserTeamOwner ? undefined : "Only team owner can delete members"}
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
  ${theme.spacing.regular.asGap};

  width: 100%;
`;
