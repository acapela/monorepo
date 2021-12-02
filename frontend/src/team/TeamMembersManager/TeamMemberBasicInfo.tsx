import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { TeamMemberEntity } from "~frontend/clientdb/teamMember";
import { Avatar } from "~frontend/ui/users/Avatar";
import { HStack } from "~ui/Stack";
import { theme } from "~ui/theme";

import { useCurrentTeam } from "../CurrentTeam";

type Props = { teamMembership: TeamMemberEntity };

export const TeamMemberBasicInfo = observer(({ teamMembership }: Props) => {
  const currentTeam = useCurrentTeam();
  const { user } = teamMembership;
  if (!user) {
    return null;
  }
  return (
    <UIHolder>
      <Avatar url={user.avatar_url} size={30} />
      <div>
        <UIUserName>{user.name}</UIUserName>
        <HStack gap={10} data-test-user-id={user.id}>
          <UIEmail>{user.email}</UIEmail>
          {!(user.has_account && teamMembership.has_joined) && <UIIndicator>(Invite pending)</UIIndicator>}
          {user.id === currentTeam?.owner_id && <UIIndicator>Owner</UIIndicator>}
        </HStack>
      </div>
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  display: flex;
  align-items: center;
  ${theme.spacing.actions.asGap};
`;

const UIUserName = styled.div`
  ${theme.typo.item.title};
`;

const UIEmail = styled.div`
  ${theme.typo.item.subtitle.medium};
`;

const UIIndicator = styled.div`
  ${theme.typo.item.secondaryTitle.secondary};
`;
