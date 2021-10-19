import { observer } from "mobx-react";
import router from "next/router";
import styled from "styled-components";

import { useAssertCurrentTeam } from "~frontend/team/CurrentTeam";
import { TeamMembersManager } from "~frontend/team/TeamMembersManager";
import { routes } from "~shared/routes";
import { Button } from "~ui/buttons/Button";
import { theme } from "~ui/theme";

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
