import { observer } from "mobx-react";
import styled from "styled-components";

import { useAssertCurrentUser } from "@aca/frontend/authentication/useCurrentUser";
import { TeamEntity } from "@aca/frontend/clientdb/team";
import { assert } from "@aca/shared/assert";
import { CloseIconButton } from "@aca/ui/buttons/CloseIconButton";
import { theme } from "@aca/ui/theme";

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
    const teamMember = team.memberships.query({ user_id: userId }).first;
    assert(teamMember, `did not find teamMember for user ${userId}`);
    teamMember.remove();
  };

  return (
    <UIPanel>
      <InviteMemberForm team={team} />
      {team.memberships.hasItems && (
        <UISelectGridContainer>
          {team.memberships.all.map((teamMembership) => {
            const isBot = teamMembership.user?.is_bot;

            if (isBot) return null;

            return (
              <UIItemHolder key={teamMembership.id}>
                <TeamMemberBasicInfo teamMembership={teamMembership} />

                <UIActionsHolder>
                  {!(teamMembership.user?.has_account && teamMembership.has_joined) && (
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    <ResendInviteButton user={teamMembership.user!} teamId={team.id} />
                  )}
                  {isCurrentUserTeamOwner && (
                    <CloseIconButton
                      isDisabled={false}
                      onClick={() => teamMembership.user && handleRemoveTeamMember(teamMembership.user.id)}
                      title={`Remove ${teamMembership.user?.name} from team`}
                      tooltip="Remove user from your team"
                    />
                  )}
                </UIActionsHolder>
              </UIItemHolder>
            );
          })}
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
