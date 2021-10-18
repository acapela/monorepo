import { observer } from "mobx-react";
import router from "next/router";
import { useState } from "react";
import styled from "styled-components";

import { routes } from "~frontend/../../shared/routes";
import { Button } from "~frontend/../../ui/buttons/Button";
import { theme } from "~frontend/../../ui/theme";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { TeamMembersManager } from "~frontend/team/TeamMembersManager";

export const InviteTeamMembersView = observer(() => {
  const user = useAssertCurrentUser();

  const currentTeam = user.currentTeam;

  if (!currentTeam) {
    return <div>No team</div>;
  }

  return (
    <UIHolder>
      <TeamMembersManager team={currentTeam} />
      <Button
        kind="primary"
        isWide
        onClick={() => {
          router.push(routes.home);
        }}
      >
        Continue
      </Button>
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  display: flex;
  flex-direction: column;
  ${theme.spacing.pageSections.asGap}
`;
