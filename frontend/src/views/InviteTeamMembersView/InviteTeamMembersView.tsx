import { observer } from "mobx-react";
import router from "next/router";
import styled from "styled-components";

import { routes } from "~frontend/../../shared/routes";
import { Button } from "~frontend/../../ui/buttons/Button";
import { theme } from "~frontend/../../ui/theme";
import { useAssertCurrentTeam } from "~frontend/team/CurrentTeam";
import { TeamMembersManager } from "~frontend/team/TeamMembersManager";

export const InviteTeamMembersView = observer(() => {
  const currentTeam = useAssertCurrentTeam();

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
        Start using the app
      </Button>
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  display: flex;
  flex-direction: column;
  ${theme.spacing.pageSections.asGap}
`;
